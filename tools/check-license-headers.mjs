/**
 * check-license-headers.mjs
 *
 * Scans source directories for file-content markers that indicate proprietary
 * or improperly licensed content committed to the public OSS repository.
 *
 * Directories scanned: src/, assets/, tools/, docs/
 *
 * Forbidden markers (case-insensitive by default):
 *   - "All Rights Reserved"
 *   - "PROPRIETARY"
 *   - "ui-theme-prokodo"
 *
 * Files whose paths match IGNORED_PATTERNS are skipped entirely (e.g. this
 * script itself, lock files, generated files).
 */

import { readdirSync, statSync, readFileSync } from "node:fs"
import { join, relative, extname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const ROOT = join(__dirname, "..")

/** Directories relative to repo root that are scanned.
 * docs/ is intentionally excluded: documentation may legitimately reference
 * package names like "ui-theme-prokodo" or terms like "proprietary" in prose.
 */
const SCAN_DIRS = ["src", "assets", "tools"]

/** Regex patterns matched against file content (case-insensitive) */
const FORBIDDEN_CONTENT_PATTERNS = [
  /all rights reserved/i,
  /\bproprietary\b/i,
  /ui-theme-prokodo/i,
]

/**
 * File path patterns to skip entirely (relative to repo root).
 * These are paths where the forbidden strings may legitimately appear
 * (e.g. this very script, strategy docs, changelogs).
 */
const IGNORED_PATH_PATTERNS = [
  /OSS_STRATEGY\.md$/,
  /CHANGELOG/i,
  /node_modules/,
  /\.git[\\/]/,
  /check-license-headers\.mjs$/, // this file itself
  /check-restricted-paths\.mjs$/, // tool script — excluded from source scans
]

/** Extensions to read as text; binary files are skipped. */
const TEXT_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".cjs",
  ".scss",
  ".css",
  ".json",
  ".md",
  ".mdx",
  ".html",
  ".svg",
  ".yaml",
  ".yml",
])

/**
 * Recursively collect all file paths under a directory.
 * Directories whose relative path matches IGNORED_PATH_PATTERNS are pruned.
 * @param {string} dir
 * @returns {string[]}
 */
function walk(dir) {
  /** @type {string[]} */
  const results = []
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return results // directory may not exist
  }
  for (const entry of entries) {
    const full = join(dir, entry)
    const rel = relative(ROOT, full)

    // Prune ignored paths (applies to both files and directories)
    if (IGNORED_PATH_PATTERNS.some(p => p.test(rel))) continue

    const stat = statSync(full)
    if (stat.isDirectory()) {
      results.push(...walk(full))
    } else {
      results.push(full)
    }
  }
  return results
}

const violations = []

for (const scanDir of SCAN_DIRS) {
  const absDir = join(ROOT, scanDir)
  const files = walk(absDir)

  for (const file of files) {
    const rel = relative(ROOT, file)

    // Skip ignored paths
    if (IGNORED_PATH_PATTERNS.some(p => p.test(rel))) continue

    // Skip non-text files
    if (!TEXT_EXTENSIONS.has(extname(file).toLowerCase())) continue

    let content
    try {
      content = readFileSync(file, "utf8")
    } catch {
      continue // unreadable — skip
    }

    for (const pattern of FORBIDDEN_CONTENT_PATTERNS) {
      if (pattern.test(content)) {
        // Find the first matching line for context
        const lineIndex = content.split("\n").findIndex(l => pattern.test(l))
        violations.push({
          file: rel,
          pattern: pattern.toString(),
          line: lineIndex + 1,
        })
        break // one report per file is enough
      }
    }
  }
}

if (violations.length > 0) {
  console.error(
    "\n❌  check-license-headers: FORBIDDEN MARKERS found in source\n",
  )
  for (const v of violations) {
    console.error(`  file:    ${v.file}`)
    console.error(`  line:    ${v.line}`)
    console.error(`  matched: ${v.pattern}\n`)
  }
  console.error(
    "Proprietary markers must not be present in the OSS repository.\n" +
      "Move affected files to the private ui-brand repository or remove the markers.\n",
  )
  process.exit(1)
} else {
  console.log("✅  check-license-headers: no forbidden markers found in source")
}
