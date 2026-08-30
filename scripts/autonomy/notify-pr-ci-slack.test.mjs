import assert from "node:assert/strict"
import { test } from "node:test"

import {
  artifactFromQualityGateComment,
  buildSlackPayload,
  notificationDecision,
} from "./notify-pr-ci-slack.mjs"
import { renderReadinessComment } from "./render-readiness-comment.mjs"

const artifact = {
  result: "HUMAN_APPROVAL_REQUIRED",
  risk: "HIGH",
  affectedConsumers: ["prokodo-portal"],
  riskSignals: [{ risk: "HIGH", reason: "change_class:security" }],
  findings: [],
  checks: [{ name: "terraform_validate", exitCode: 0 }],
  environment: {
    used: ["PRIVATE_TOKEN"],
    declared: ["PRIVATE_TOKEN"],
    provisioned: ["PRIVATE_TOKEN"],
  },
}

const baseInput = {
  artifact,
  actor: "maintainer",
  branch: "feat/example",
  checkRuns: [{ name: "Semgrep", status: "completed", conclusion: "success" }],
  commit: "56f95bf8e4226022353b0d9d401ff220fd395af6",
  jobResult: "success",
  jobs: [],
  prNumber: 75,
  prTitle: "Improve <quality>",
  prUrl: "https://github.com/prokodo-agency/prokodo-api/pull/75",
  qualityGateUrl:
    "https://github.com/prokodo-agency/prokodo-api/pull/75#issuecomment-1",
  repository: "prokodo-agency/prokodo-api",
  runId: "123",
  runUrl: "https://github.com/prokodo-agency/prokodo-api/actions/runs/123",
}

test("renders a rich ready-for-admin-review Slack payload", () => {
  const payload = buildSlackPayload(baseInput)
  const output = JSON.stringify(payload)

  assert.match(payload.text, /PR ready for admin review/u)
  assert.match(output, /Admin approval required/u)
  assert.match(output, /prokodo-portal/u)
  assert.match(output, /No new readiness findings/u)
  assert.match(output, /Open workflow/u)
  assert.doesNotMatch(output, /PRIVATE_TOKEN/u)
  assert.doesNotMatch(output, /Improve <quality>/iu)
})

test("renders failed jobs, failed checks and readiness findings directly", () => {
  const payload = buildSlackPayload({
    ...baseInput,
    artifact: {
      ...artifact,
      result: "BLOCKED",
      findings: [
        { code: "TERRAFORM_VALIDATION_FAILED", path: "infrastructure" },
      ],
    },
    jobResult: "failure",
    jobs: [
      {
        name: "CI",
        html_url: "https://github.com/example/job/1",
        steps: [{ name: "Unit tests", conclusion: "failure" }],
      },
    ],
    checkRuns: [
      {
        name: "Semgrep",
        status: "completed",
        conclusion: "failure",
        details_url: "https://github.com/example/check/1",
        output: { title: "One blocking finding" },
      },
    ],
  })
  const output = JSON.stringify(payload)

  assert.match(payload.text, /quality gate failed/u)
  assert.match(output, /CI › Unit tests/u)
  assert.match(output, /Semgrep: One blocking finding/u)
  assert.match(output, /TERRAFORM_VALIDATION_FAILED/u)
})

test("reads the value-free readiness contract from the sticky PR comment", () => {
  const commit = "56f95bf8e4226022353b0d9d401ff220fd395af6"
  const comment = renderReadinessComment(artifact, { commit })
  const parsed = artifactFromQualityGateComment(comment, commit)

  assert.equal(parsed.result, "HUMAN_APPROVAL_REQUIRED")
  assert.equal(parsed.risk, "HIGH")
  assert.deepEqual(parsed.environmentCounts, {
    runtime: 1,
    declared: 1,
    provisioned: 1,
  })
  assert.doesNotMatch(JSON.stringify(parsed), /PRIVATE_TOKEN/u)
  assert.equal(artifactFromQualityGateComment(comment, "different"), null)
})

test("notifies failures immediately and success only after the complete gate", () => {
  const monitoredWorkflows = ["ci", "semgrep"]
  const running = [
    { name: "ci", status: "completed", conclusion: "success" },
    { name: "semgrep", status: "in_progress", conclusion: null },
  ]
  const complete = [
    { name: "ci", status: "completed", conclusion: "success" },
    { name: "semgrep", status: "completed", conclusion: "success" },
  ]

  assert.deepEqual(
    notificationDecision({
      currentHeadSha: "abc",
      expectedHeadSha: "abc",
      monitoredWorkflows,
      sourceConclusion: "success",
      workflowRuns: running,
    }),
    { notify: false, reason: "quality_gate_running" },
  )
  assert.deepEqual(
    notificationDecision({
      currentHeadSha: "abc",
      expectedHeadSha: "abc",
      monitoredWorkflows,
      sourceConclusion: "failure",
      workflowRuns: running,
    }),
    { notify: true, reason: "source_failure" },
  )
  assert.deepEqual(
    notificationDecision({
      currentHeadSha: "abc",
      expectedHeadSha: "abc",
      monitoredWorkflows,
      sourceConclusion: "success",
      workflowRuns: complete,
    }),
    { notify: true, reason: "quality_gate_complete" },
  )
  assert.deepEqual(
    notificationDecision({
      checkRuns: [
        {
          app: { slug: "github-code-scanning" },
          status: "in_progress",
          conclusion: null,
        },
      ],
      currentHeadSha: "abc",
      expectedHeadSha: "abc",
      monitoredWorkflows,
      sourceConclusion: "success",
      workflowRuns: complete,
    }),
    { notify: false, reason: "quality_gate_running" },
  )
  assert.deepEqual(
    notificationDecision({
      currentHeadSha: "new",
      expectedHeadSha: "old",
      monitoredWorkflows,
      sourceConclusion: "failure",
      workflowRuns: complete,
    }),
    { notify: false, reason: "superseded_commit" },
  )
})
