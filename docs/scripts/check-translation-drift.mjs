#!/usr/bin/env node
/**
 * check-translation-drift.mjs
 *
 * Compares the git-commit timestamp of each EN component MDX with its DE
 * counterpart.  Warns whenever the EN source is newer than the translation
 * (or the translation is missing entirely).
 *
 * Exit code: always 0 — this is an advisory warning only.
 * Use in CI to surface drift without blocking the build.
 *
 * Usage:
 *   node scripts/check-translation-drift.mjs
 */

import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// ── helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns the unix epoch (seconds) of the last git commit that touched
 * `filePath`, or `null` when the file is untracked / outside the repo.
 */
function gitMtime(filePath) {
  try {
    const out = execSync(`git log -1 --format=%ct -- "${filePath}"`, {
      cwd: ROOT,
      stdio: ['pipe', 'pipe', 'pipe'],
    })
      .toString()
      .trim()
    return out ? Number(out) : null
  } catch {
    return null
  }
}

/** ANSI helpers */
const yellow = (s) => `\x1b[33m${s}\x1b[0m`
const red = (s) => `\x1b[31m${s}\x1b[0m`
const green = (s) => `\x1b[32m${s}\x1b[0m`
const bold = (s) => `\x1b[1m${s}\x1b[0m`

// ── load component list ───────────────────────────────────────────────────────

const componentsPath = join(ROOT, 'src', 'components.json')
const components = JSON.parse(await readFile(componentsPath, 'utf8'))

const EN_DIR = join(ROOT, 'docs', 'components')
const DE_DIR = join(
  ROOT,
  'i18n',
  'de',
  'docusaurus-plugin-content-docs',
  'current',
  'components'
)

// ── check each component ──────────────────────────────────────────────────────

let warnings = 0
let missing = 0

console.log(bold('\n🔍  Translation drift check\n'))

for (const { slug } of components) {
  const enFile = join(EN_DIR, `${slug}.mdx`)
  const deFile = join(DE_DIR, `${slug}.mdx`)

  if (!existsSync(enFile)) continue // EN file not yet created — skip

  if (!existsSync(deFile)) {
    console.log(red(`  ✗ MISSING  de/${slug}.mdx`))
    missing++
    continue
  }

  const enMtime = gitMtime(enFile)
  const deMtime = gitMtime(deFile)

  if (enMtime === null || deMtime === null) {
    // Untracked file — skip silently
    continue
  }

  if (enMtime > deMtime) {
    const enDate = new Date(enMtime * 1000).toISOString().slice(0, 10)
    const deDate = new Date(deMtime * 1000).toISOString().slice(0, 10)
    console.log(
      yellow(`  ⚠ STALE   de/${slug}.mdx`) +
        `  (EN: ${enDate}  DE: ${deDate})`
    )
    warnings++
  }
}

// ── summary ───────────────────────────────────────────────────────────────────

console.log()
if (missing === 0 && warnings === 0) {
  console.log(green('  ✓ All DE translations are up to date.\n'))
} else {
  if (missing > 0)
    console.log(red(`  ${missing} translation(s) are missing.`))
  if (warnings > 0)
    console.log(yellow(`  ${warnings} translation(s) are stale.`))
  console.log()
}

process.exit(0)
