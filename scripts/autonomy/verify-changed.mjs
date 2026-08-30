#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { spawnSync } from "node:child_process"

import {
  analyzeRepository,
  classifyCommandFailure,
  determineReadinessState,
  exitCodeFor,
  parseArguments,
} from "./core.mjs"

const root = resolve(import.meta.dirname, "../..")
const options = parseArguments(process.argv.slice(2))
const artifactPath = resolve(
  root,
  options.json ?? ".prokodo/artifacts/changed-validation.json",
)
const failureArtifactPath = resolve(root, ".prokodo/artifacts/failure.json")

const persist = artifact => {
  mkdirSync(dirname(artifactPath), { recursive: true })
  writeFileSync(artifactPath, `${JSON.stringify(artifact, null, 2)}\n`, {
    mode: 0o600,
  })
  if (artifact.failure !== undefined) {
    writeFileSync(
      failureArtifactPath,
      `${JSON.stringify({ schemaVersion: 1, repository: artifact.repository, ...artifact.failure }, null, 2)}\n`,
      { mode: 0o600 },
    )
  }
  process.stdout.write(`${JSON.stringify(artifact, null, 2)}\n`)
}

try {
  const analysis = analyzeRepository(root, options.base)
  const selected = new Map()
  selected.set("pnpm test:autonomy", ["pnpm", "test:autonomy"])
  for (const rule of analysis.contract.changedValidation ?? []) {
    if (!rule.when.some(value => analysis.changeClasses.includes(value)))
      continue
    for (const command of rule.commands) {
      const args = command.map(value =>
        value.replaceAll("{base}", analysis.base),
      )
      selected.set(args.join(" "), args)
    }
  }

  const checks = []
  let failure = null
  for (const [display, [command, ...args]] of selected) {
    const run = spawnSync(command, args, {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    })
    if (run.stdout) process.stdout.write(run.stdout)
    if (run.stderr) process.stderr.write(run.stderr)
    checks.push({ command: display, exitCode: run.status ?? 1 })
    if (run.status !== 0) {
      const output = `${run.stdout ?? ""}\n${run.stderr ?? ""}`
      failure = {
        classification: classifyCommandFailure({ command: display, output }),
        command: display,
        exitCode: run.status ?? 1,
        evidence: ["command_exited_nonzero"],
        recommendedAction:
          "Classify and repair the root cause; do not weaken the gate.",
        retryable: false,
      }
      break
    }
  }

  const findings = [
    ...analysis.contractErrors.map(detail => ({
      code: "ENGINEERING_CONTRACT_INVALID",
      severity: "error",
      detail,
    })),
    ...(failure === null
      ? []
      : [{ code: "CHANGED_VALIDATION_FAILED", severity: "error" }]),
  ]
  const result = determineReadinessState({ risk: analysis.risk, findings })
  const artifact = {
    schemaVersion: 1,
    repository: analysis.contract.repository.name,
    result,
    risk: analysis.risk,
    base: analysis.base,
    changeClasses: analysis.changeClasses,
    changedFiles: analysis.changedFiles,
    checks,
    affectedConsumers: analysis.affectedConsumers,
    ...(failure === null ? {} : { failure }),
  }
  persist(artifact)
  process.exitCode = exitCodeFor(result)
} catch (error) {
  const artifact = {
    schemaVersion: 1,
    repository: "prokodo-ui",
    result: "BLOCKED",
    risk: "CRITICAL",
    changeClasses: [],
    checks: [],
    affectedConsumers: [],
    failure: {
      classification: "HARNESS",
      command: "verify:changed",
      exitCode: 30,
      evidence: [
        error instanceof Error ? error.message : "unknown_harness_error",
      ],
      recommendedAction: "Repair the repository-native validation harness.",
      retryable: false,
    },
  }
  persist(artifact)
  process.exitCode = 30
}
