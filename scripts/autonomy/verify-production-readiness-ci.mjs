#!/usr/bin/env node
import { spawnSync } from "node:child_process"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

const REVIEW_ONLY_EXIT_CODES = new Set([10, 20])

export const ciExitCodeFor = exitCode =>
  exitCode === 0 || REVIEW_ONLY_EXIT_CODES.has(exitCode) ? 0 : exitCode || 30

export const runProductionReadinessForCi = args => {
  const command = spawnSync(
    process.execPath,
    [resolve(import.meta.dirname, "verify-production-readiness.mjs"), ...args],
    { stdio: "inherit" },
  )
  if (command.error) {
    process.stderr.write(
      `Production readiness could not start: ${command.error.message}\n`,
    )
    return 30
  }

  const exitCode = command.status ?? 30
  if (exitCode === 10) {
    process.stdout.write(
      "::notice title=Production readiness::Advisories recorded; automated verification passed.\n",
    )
  }
  if (exitCode === 20) {
    process.stdout.write(
      "::notice title=Production readiness::Automated verification passed; protected public-package action requires repository-admin approval.\n",
    )
  }
  return ciExitCodeFor(exitCode)
}

if (resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) {
  process.exitCode = runProductionReadinessForCi(process.argv.slice(2))
}
