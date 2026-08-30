import assert from "node:assert/strict"
import { test } from "node:test"

import {
  affectedConsumersFor,
  classifyChanges,
  detectCredentialPaths,
  detectInfrastructureDependencyDriftFromFileMap,
  determineReadinessState,
  determineRisk,
  findingsFromEnvironment,
  inspectEnvironmentFromFileMap,
  validateContract,
} from "./core.mjs"

const environment = {
  sourceDirectories: ["src"],
  declarationFiles: [".env.example", "docs/env-vars.md"],
  provisioningSources: ["infrastructure", ".github/workflows"],
  allowDynamic: [],
  allowDocumentedUnused: [],
  allowProvisionedUnused: [],
  allowPublic: [],
}
const contract = {
  schemaVersion: 1,
  repository: { name: "fixture" },
  runtime: { node: "22", packageManager: "pnpm@10" },
  commands: { verifyChanged: "x", verify: "x", verifyProductionReadiness: "x" },
  staticAnalysis: {
    newFindings: "ZERO_TOLERANCE",
    autofixPolicy: "SAFE_AUTOFIX_THEN_BLOCK",
    scanners: [],
  },
  entryPoints: [],
  deployables: [],
  criticalPaths: [],
  infrastructureDirectories: [],
  secretReferenceSources: [],
  terraformDirectories: [],
  ciWorkflows: [],
  previewTypes: [],
  validationArtifacts: [],
  relationships: {
    providers: [],
    consumers: ["consumer-a"],
    contractPaths: ["^src/contracts/"],
  },
  browser: { relevant: false },
  riskPaths: [],
  environment,
}

const inspect = files => inspectEnvironmentFromFileMap({ files, environment })

test("detects a newly used environment name without a declaration", () => {
  assert.deepEqual(
    inspect([
      { path: "src/config.ts", content: "process.env.NEW_RUNTIME_NAME" },
    ]).missing,
    ["NEW_RUNTIME_NAME"],
  )
})

test("reports a documented but unused environment name", () => {
  assert.deepEqual(
    inspect([{ path: ".env.example", content: "OLD_NAME=\n" }])
      .documentedUnused,
    ["OLD_NAME"],
  )
})

test("reports a provisioned but unused environment name", () => {
  assert.deepEqual(
    inspect([
      {
        path: ".github/workflows/ci.yml",
        content: "  OLD_PROVISIONED: ${{ vars.OLD_PROVISIONED }}",
      },
    ]).provisionedUnused,
    ["OLD_PROVISIONED"],
  )
})

test("allows a dynamic environment name only through an explicit allowlist", () => {
  const result = inspectEnvironmentFromFileMap({
    files: [{ path: "src/config.ts", content: "process.env.DYNAMIC_NAME" }],
    environment: {
      ...environment,
      allowDynamic: [{ name: "DYNAMIC_NAME", reason: "provider-owned" }],
    },
  })
  assert.deepEqual(result.missing, [])
})

test("blocks a secret-like NEXT_PUBLIC name", () => {
  assert.deepEqual(
    inspect([
      {
        path: "src/config.ts",
        content: "process.env.NEXT_PUBLIC_PRIVATE_TOKEN",
      },
    ]).publicSecretExposure,
    ["NEXT_PUBLIC_PRIVATE_TOKEN"],
  )
})

test("detects a newly tracked credential path without reading it", () => {
  assert.deepEqual(
    detectCredentialPaths(["safe.json", "ops/service-account.json"]),
    ["ops/service-account.json"],
  )
})

test("blocks a new infrastructure dependency without a declaration", () => {
  assert.deepEqual(
    detectInfrastructureDependencyDriftFromFileMap({
      files: [
        {
          path: "src/worker.ts",
          content: 'import { CloudTasksClient } from "@google-cloud/tasks"',
        },
      ],
      diffs: new Map([
        [
          "src/worker.ts",
          '+++ b/src/worker.ts\n+import { CloudTasksClient } from "@google-cloud/tasks"',
        ],
      ]),
      contract,
    }),
    [
      {
        code: "INFRASTRUCTURE_DEPENDENCY_UNDECLARED",
        severity: "error",
        dependency: "cloud_tasks",
        path: "src/worker.ts",
      },
    ],
  )
})

test("ignores infrastructure vocabulary in harness and test-only files", () => {
  assert.deepEqual(
    detectInfrastructureDependencyDriftFromFileMap({
      files: [],
      diffs: new Map([
        [
          "scripts/autonomy/core.test.mjs",
          "+import { CloudTasksClient } from '@google-cloud/tasks'",
        ],
        [
          "src/worker.test.ts",
          "+import { CloudTasksClient } from '@google-cloud/tasks'",
        ],
      ]),
      contract,
    }),
    [],
  )
})

test("classifies Terraform changes as HIGH", () => {
  const paths = ["infrastructure/main.tf"]
  assert.equal(
    determineRisk({
      paths,
      classes: classifyChanges(paths),
      contract,
      diffs: new Map(),
    }).risk,
    "HIGH",
  )
})

test("classifies auth changes as HIGH", () => {
  const paths = ["src/auth/session.ts"]
  assert.equal(
    determineRisk({
      paths,
      classes: classifyChanges(paths),
      contract,
      diffs: new Map(),
    }).risk,
    "HIGH",
  )
})

test("classifies copy changes as LOW", () => {
  const paths = ["docs/copy.md"]
  assert.equal(
    determineRisk({
      paths,
      classes: classifyChanges(paths),
      contract,
      diffs: new Map(),
    }).risk,
    "LOW",
  )
})

test("classifies a normal source feature as MEDIUM", () => {
  const paths = ["src/features/report.ts"]
  assert.equal(
    determineRisk({
      paths,
      classes: classifyChanges(paths),
      contract,
      diffs: new Map(),
    }).risk,
    "MEDIUM",
  )
})

test("highest risk signal wins", () => {
  const paths = ["docs/copy.md", "src/auth/session.ts", "ops/private.key"]
  assert.equal(
    determineRisk({
      paths,
      classes: classifyChanges(paths),
      contract,
      diffs: new Map(),
    }).risk,
    "CRITICAL",
  )
})

test("marks consumers when a provider contract changes", () => {
  assert.deepEqual(
    affectedConsumersFor(["src/contracts/report.ts"], contract),
    ["consumer-a"],
  )
})

test("returns BLOCKED for an error finding", () => {
  assert.equal(
    determineReadinessState({
      risk: "MEDIUM",
      findings: [{ severity: "error" }],
    }),
    "BLOCKED",
  )
})

test("returns HUMAN_APPROVAL_REQUIRED for HIGH risk", () => {
  assert.equal(
    determineReadinessState({ risk: "HIGH", findings: [] }),
    "HUMAN_APPROVAL_REQUIRED",
  )
})

test("never includes an environment value in scanner output", () => {
  const result = inspect([
    {
      path: ".env.example",
      content: "PRIVATE_TOKEN=do-not-persist-this-value\n",
    },
  ])
  assert.equal(
    JSON.stringify(result).includes("do-not-persist-this-value"),
    false,
  )
})

test("reports only drift introduced after the selected base", () => {
  const current = inspect([
    {
      path: "src/config.ts",
      content: "process.env.OLD_NAME; process.env.NEW_NAME",
    },
  ])
  const baseline = inspect([
    { path: "src/config.ts", content: "process.env.OLD_NAME" },
  ])
  assert.deepEqual(findingsFromEnvironment(current, baseline), [
    { code: "ENV_USED_UNDECLARED", severity: "error", name: "NEW_NAME" },
  ])
})

test("validates the versioned engineering contract", () => {
  assert.deepEqual(validateContract(contract), [])
})
