/**
 * check-restricted-paths.mjs
 *
 * Scans the dist/ directory for:
 *   1. File-path patterns that should never appear in the public OSS build.
 *   2. File-content patterns inside .js / .mjs / .cjs / .css files.
 *
 * Fails with a non-zero exit code if any violations are detected, or if
 * dist/ does not exist (guards against a stale / missing build).
 *
 * Patterns watched:
 *   - ui-theme-prokodo     — private branded theme package name
 *   - themes/prokodo       — branded theme directory path
 *   - assets/brand/        — brand asset directory
 *   - assets/press-kit/    — press-kit asset directory
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { extname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const DIST_DIR = join(__dirname, "..", "dist")

// ── Fail fast if dist/ is absent ──────────────────────────────────────────────
if (!existsSync(DIST_DIR)) {
  console.error(
    "❌  check-restricted-paths: dist/ does not exist.\n" +
      "    Run `pnpm build` before publishing.\n",
  )
  process.exit(1)
}

/** Patterns matched against the relative path of every file in dist/ */
const RESTRICTED_PATH_PATTERNS = [
  /ui-theme-prokodo/,
  /themes[\\/]prokodo/,
  /assets[\\/]brand/,
  /assets[\\/]press-kit/,
]

/** Same patterns matched against file CONTENT for text assets */
const RESTRICTED_CONTENT_PATTERNS = [
  /ui-theme-prokodo/,
  /themes\/prokodo/,
  /assets\/brand/,
  /assets\/press-kit/,
]

/** Extensions whose content is scanned */
const SCANNABLE_EXTENSIONS = new Set([".js", ".mjs", ".cjs", ".css"])

/**
 * Recursively collect all file paths under a directory.
 * @param {string} dir
 * @returns {string[]}
 */
function walk(dir) {
  /** @type {string[]} */
  const results = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      results.push(...walk(full))
    } else {
      results.push(full)
    }
  }
  return results
}

const files = walk(DIST_DIR)
const violations = []

for (const file of files) {
  const rel = relative(DIST_DIR, file)

  // 1. Path-level check
  for (const pattern of RESTRICTED_PATH_PATTERNS) {
    if (pattern.test(rel)) {
      violations.push({ file: rel, kind: "path", pattern: pattern.toString() })
    }
  }

  // 2. Content-level check (text assets only)
  if (SCANNABLE_EXTENSIONS.has(extname(file))) {
    let content
    try {
      content = readFileSync(file, "utf8")
    } catch {
      continue
    }
    for (const pattern of RESTRICTED_CONTENT_PATTERNS) {
      if (pattern.test(content)) {
        violations.push({
          file: rel,
          kind: "content",
          pattern: pattern.toString(),
        })
        break // one report per file is enough
      }
    }
  }
}

if (violations.length > 0) {
  console.error("\n❌  check-restricted-paths: VIOLATIONS FOUND in dist/\n")
  for (const v of violations) {
    console.error(`  [${v.kind}]  ${v.file}`)
    console.error(`  matched:     ${v.pattern}\n`)
  }
  console.error(
    "Branded or proprietary content must NOT be included in the public OSS build.\n" +
      "Move these assets to the private ui-brand repository before publishing.\n",
  )
  process.exit(1)
} else {
  console.log(
    "✅  check-restricted-paths: no restricted paths or content found in dist/",
  )
}
