/**
 * inject-css-deps.mjs
 *
 * Post-build step that makes each component's CSS self-contained:
 *
 * 1. Scans src/components for cross-component imports (from "../<dep>")
 *    to build a direct-dependency map.
 * 2. For every component in dist that has CSS:
 *    a. Prepends import statements for every direct dependency that has CSS.
 *       Transitive deps are resolved automatically through the import chain
 *       (e.g. PostItem → Card → Headline → RichText).
 *    b. Merges secondary CSS files (PostItemAuthor.css, FormResponse.css)
 *       into the primary CSS file so a single import covers everything.
 *
 * Run AFTER  duplicate-css-modules.mjs  (creates the .css files)
 * Run BEFORE update-exports.mjs         (points package.json to them)
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")
const srcComponentsDir = path.join(rootDir, "src/components")
const distComponentsDir = path.join(rootDir, "dist/components")

// ---------------------------------------------------------------------------
// 1. Build the direct-dependency map from source imports
// ---------------------------------------------------------------------------
function getAllSourceFiles(dir) {
  const results = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...getAllSourceFiles(fullPath))
    } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      results.push(fullPath)
    }
  }
  return results
}

function buildDepMap() {
  const depMap = {} // { componentName: Set<depName> }
  const dirs = readdirSync(srcComponentsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)

  for (const name of dirs) {
    const compDir = path.join(srcComponentsDir, name)
    depMap[name] = new Set()

    for (const file of getAllSourceFiles(compDir)) {
      const content = readFileSync(file, "utf-8")
      for (const match of content.matchAll(/from\s+["']\.\.\/([^/"']+)/g)) {
        const dep = match[1]
        if (dep !== name) depMap[name].add(dep)
      }
    }
  }
  return depMap
}

// ---------------------------------------------------------------------------
// 2. For each dist component, find CSS files (primary + secondary)
// ---------------------------------------------------------------------------
function getCssFiles(componentName) {
  const dir = path.join(distComponentsDir, componentName)
  if (!existsSync(dir)) return { primary: null, secondary: [] }

  const allCss = readdirSync(dir)
    .filter(f => f.endsWith(".css") && !f.endsWith(".module.css"))
    .sort()

  if (allCss.length === 0) return { primary: null, secondary: [] }

  return {
    primary: allCss[0],
    secondary: allCss.slice(1),
  }
}

// ---------------------------------------------------------------------------
// 3. Main: inject @import + merge sub-component CSS
// ---------------------------------------------------------------------------
function main() {
  const depMap = buildDepMap()
  let modified = 0

  const dirs = readdirSync(distComponentsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)

  for (const name of dirs) {
    const { primary, secondary } = getCssFiles(name)
    if (!primary) continue

    const primaryPath = path.join(distComponentsDir, name, primary)
    const primaryContent = readFileSync(primaryPath, "utf-8")

    // @import lines for direct dependencies that have CSS
    const deps = depMap[name] || new Set()
    const imports = []
    for (const dep of [...deps].sort()) {
      const depCss = getCssFiles(dep)
      if (depCss.primary) {
        imports.push(`@import "../${dep}/${depCss.primary}";`)
      }
    }

    // Read & merge secondary CSS files (e.g. PostItemAuthor.css → PostItem.css)
    const secondaryContents = secondary.map(f =>
      readFileSync(path.join(distComponentsDir, name, f), "utf-8"),
    )

    // Assemble final CSS
    const parts = []
    if (imports.length > 0) parts.push(imports.join("\n"))
    parts.push(primaryContent)
    if (secondaryContents.length > 0) parts.push(...secondaryContents)

    const finalCss = parts.join("\n\n")

    if (finalCss !== primaryContent) {
      writeFileSync(primaryPath, finalCss)
      modified++
      const info = []
      if (imports.length) info.push(`${imports.length} @import(s)`)
      if (secondary.length) info.push(`merged ${secondary.join(", ")}`)
      console.log(`  ${name}: ${info.join(" + ")}`)
    }
  }

  console.log(`\n✅ Injected CSS dependencies into ${modified} component(s).`)
}

main()
