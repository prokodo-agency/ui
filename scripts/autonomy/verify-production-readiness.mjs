#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { spawnSync } from "node:child_process"

import {
  analyzeRepository,
  detectCredentialPaths,
  determineReadinessState,
  exitCodeFor,
  findingsFromEnvironment,
  inspectRepositoryEnvironment,
  inspectRepositoryEnvironmentAtRef,
  parseArguments,
} from "./core.mjs"

const root = resolve(import.meta.dirname, "../..")
const options = parseArguments(process.argv.slice(2))
const artifactPath = resolve(
  root,
  options.json ?? ".prokodo/artifacts/production-readiness.json",
)
const failureArtifactPath = resolve(root, ".prokodo/artifacts/failure.json")

const writeArtifact = artifact => {
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
  const inventory = inspectRepositoryEnvironment(root, analysis.contract)
  const baselineInventory = inspectRepositoryEnvironmentAtRef(
    root,
    analysis.contract,
    analysis.base,
  )
  const findings = findingsFromEnvironment(inventory, baselineInventory)
  findings.push(...analysis.infrastructureDependencyFindings)
  for (const path of detectCredentialPaths(analysis.changedFiles)) {
    findings.push({
      code: "FORBIDDEN_CREDENTIAL_PATH",
      severity: "critical",
      path,
    })
  }
  for (const error of analysis.contractErrors) {
    findings.push({
      code: "ENGINEERING_CONTRACT_INVALID",
      severity: "error",
      detail: error,
    })
  }

  const checks = []
  if (analysis.changeClasses.includes("terraform")) {
    for (const directory of analysis.contract.terraformDirectories) {
      for (const [name, args] of [
        [
          "terraform_fmt",
          ["-chdir=" + directory, "fmt", "-check", "-recursive"],
        ],
        [
          "terraform_init",
          ["-chdir=" + directory, "init", "-backend=false", "-input=false"],
        ],
        [
          "terraform_validate",
          ["-chdir=" + directory, "validate", "-no-color"],
        ],
      ]) {
        const command = spawnSync("terraform", args, {
          cwd: root,
          encoding: "utf8",
          maxBuffer: 8 * 1024 * 1024,
        })
        checks.push({ name, directory, exitCode: command.status ?? 1 })
        if (command.status !== 0) {
          findings.push({
            code: "TERRAFORM_VALIDATION_FAILED",
            severity: "error",
            check: name,
            directory,
          })
        }
      }
    }
  }

  if (options.terraformPlanJson !== null) {
    const plan = JSON.parse(
      readFileSync(resolve(root, options.terraformPlanJson), "utf8"),
    )
    const actions = (plan.resource_changes ?? []).flatMap(
      change => change.change?.actions ?? [],
    )
    const destructive =
      actions.includes("delete") ||
      actions.includes("replace") ||
      (actions.includes("delete") && actions.includes("create"))
    checks.push({
      name: "terraform_plan_classification",
      actions: [...new Set(actions)].sort(),
    })
    if (destructive)
      findings.push({
        code: "TERRAFORM_DESTRUCTIVE_PLAN",
        severity: "critical",
      })
  }

  const result = determineReadinessState({ risk: analysis.risk, findings })
  const artifact = {
    schemaVersion: 1,
    repository: analysis.contract.repository.name,
    result,
    risk: analysis.risk,
    base: analysis.base,
    changeClasses: analysis.changeClasses,
    changedFiles: analysis.changedFiles,
    affectedConsumers: analysis.affectedConsumers,
    riskSignals: analysis.riskSignals,
    findings,
    checks,
    environment: {
      used: inventory.used,
      declared: inventory.declared,
      provisioned: inventory.provisioned,
      preExistingDriftCounts: {
        missing: baselineInventory.missing.length,
        documentedUnused: baselineInventory.documentedUnused.length,
        provisionedUnused: baselineInventory.provisionedUnused.length,
        publicSecretExposure: baselineInventory.publicSecretExposure.length,
      },
    },
  }
  writeArtifact(artifact)
  process.exitCode = exitCodeFor(result)
} catch (error) {
  const artifact = {
    schemaVersion: 1,
    repository: "prokodo-ui",
    result: "BLOCKED",
    risk: "CRITICAL",
    failure: {
      classification: "HARNESS",
      command: "verify:production-readiness",
      exitCode: 30,
      evidence: [
        error instanceof Error ? error.message : "unknown_harness_error",
      ],
      recommendedAction:
        "Repair the repository-native validation harness before changing product code.",
      retryable: false,
    },
  }
  writeArtifact(artifact)
  process.exitCode = 30
}
