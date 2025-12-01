import { readdirSync, readFileSync, writeFileSync, existsSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")
const componentsDir = path.join(rootDir, "src/components")
const distComponentsDir = path.join(rootDir, "dist/components")
const packageJsonPath = path.join(rootDir, "package.json")

// Load package.json
const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"))

// Base exports (root entry, helpers, runtime, theme.css)
const exportsField = {
  "./theme.css": "./dist/theme.css",
  ".": {
    types: "./dist/types/index.d.ts",
    import: "./dist/index.js",
  },
  "./createIsland": {
    types: "./dist/types/helpers/createIsland.d.ts",
    import: "./dist/helpers/createIsland.js",
  },
  "./createLazyWrapper": {
    types: "./dist/types/helpers/createLazyWrapper.d.ts",
    import: "./dist/helpers/createLazyWrapper.js",
  },
  "./runtime": {
    types: "./dist/types/helpers/runtime.client.d.ts",
    import: "./dist/helpers/runtime.client.js",
  },
}

// Detect components based on src/components/*/index.ts
const components = readdirSync(componentsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)

for (const name of components) {
  const entryFile = path.join(componentsDir, name, "index.ts")
  if (!existsSync(entryFile)) continue

  // JS + types export for the component
  exportsField[`./${name}`] = {
    import: `./dist/components/${name}/index.js`,
    types: `./dist/types/components/${name}/index.d.ts`,
  }

  // Optional: CSS export for the component (if present in dist)
  const distDir = path.join(distComponentsDir, name)
  if (existsSync(distDir)) {
    const files = readdirSync(distDir)

    // Prefer a "base" CSS file (no .effects., no .module.css)
    const cssFile =
      files.find(
        f =>
          f.endsWith(".css") &&
          !f.endsWith(".module.css") &&
          !f.includes(".effects."),
      ) ??
      // Fallback: any .css that is not a module
      files.find(f => f.endsWith(".css") && !f.endsWith(".module.css"))

    if (cssFile) {
      exportsField[`./${name}.css`] = `./dist/components/${name}/${cssFile}`
    }
  }
}

// Update package.json exports
pkg.exports = exportsField

writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + "\n")
console.log(
  `✅ package.json "exports" updated with ${components.length} components.`,
)
