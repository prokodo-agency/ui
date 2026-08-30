import assert from "node:assert/strict"
import { test } from "node:test"

import {
  COMMENT_MARKER,
  renderReadinessComment,
  renderUnavailableComment,
} from "./render-readiness-comment.mjs"

const artifact = {
  repository: "prokodo-api",
  result: "HUMAN_APPROVAL_REQUIRED",
  risk: "HIGH",
  base: "610fd483387211fac1ea61746e8fe9385deb4735",
  changeClasses: ["deployment", "env", "security", "terraform"],
  changedFiles: [".github/workflows/ci.yml", "infrastructure/main.tf"],
  affectedConsumers: [],
  riskSignals: [{ risk: "HIGH", reason: "change_class:deployment" }],
  findings: [],
  checks: [
    { name: "terraform_validate", directory: "infrastructure", exitCode: 0 },
  ],
  environment: {
    used: ["PRIVATE_TOKEN"],
    declared: ["PRIVATE_TOKEN"],
    provisioned: ["PRIVATE_TOKEN"],
    preExistingDriftCounts: {
      missing: 1,
      documentedUnused: 2,
      provisionedUnused: 3,
      publicSecretExposure: 0,
    },
  },
}

test("renders a human approval summary bound to the current commit", () => {
  const output = renderReadinessComment(artifact, {
    commit: "56f95bf8e4226022353b0d9d401ff220fd395af6",
    runUrl: "https://github.com/prokodo-agency/prokodo-api/actions/runs/1",
  })

  assert.match(output, new RegExp(COMMENT_MARKER))
  assert.match(output, /Human approval required/u)
  assert.match(output, /exact commit `56f95bf8e422`/u)
  assert.match(output, /terraform_validate/u)
  assert.match(output, /No new readiness findings/u)
  assert.doesNotMatch(output, /PRIVATE_TOKEN/u)
})

test("escapes untrusted artifact text before rendering markdown", () => {
  const output = renderReadinessComment(
    {
      ...artifact,
      riskSignals: [{ risk: "HIGH", reason: "<script>|`unsafe`" }],
    },
    { commit: "abcdef0123456789" },
  )

  assert.doesNotMatch(output, /<script>/iu)
  assert.match(output, /&lt;script&gt;&#124;&#96;unsafe&#96;/u)
})

test("renders a fail-closed comment when the artifact is unavailable", () => {
  const output = renderUnavailableComment({
    commit: "abcdef0123456789",
    repository: "prokodo-api",
    reason: "readiness_artifact_missing",
  })

  assert.match(output, /Artifact unavailable/u)
  assert.match(output, /Treat this commit as blocked/u)
})
