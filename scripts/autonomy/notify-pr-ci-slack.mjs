#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { COMMENT_DATA_PREFIX } from "./render-readiness-comment.mjs"

const FAILURE_CONCLUSIONS = new Set([
  "action_required",
  "cancelled",
  "failure",
  "startup_failure",
  "stale",
  "timed_out",
])
const CODE_TICK = String.fromCharCode(96)

const slackText = value =>
  String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/gu, " ")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("|", "¦")
    .trim()

const compactSha = value => {
  const sha = String(value ?? "unknown")
  return /^[0-9a-f]{7,64}$/iu.test(sha) ? sha.slice(0, 12) : slackText(sha)
}

const safeUrl = value => {
  try {
    const url = new URL(String(value))
    return url.protocol === "https:" ? url.href : null
  } catch {
    return null
  }
}

const truncate = (value, limit = 280) => {
  const text = slackText(value)
  return text.length <= limit ? text : text.slice(0, limit - 1) + "…"
}

const list = (values, limit = 6) =>
  values
    .slice(0, limit)
    .map(value => "• " + value)
    .join("\n")

const gateLabel = artifact => {
  switch (artifact?.result) {
    case "PASS":
      return "✅ Ready"
    case "PASS_WITH_ADVISORIES":
      return "⚠️ Passed with advisories"
    case "HUMAN_APPROVAL_REQUIRED":
      return "🔐 Admin approval required"
    case "BLOCKED":
      return "⛔ Blocked"
    default:
      return "❔ Not evaluated"
  }
}

const failedItems = (jobs, externalChecks) => {
  const items = []
  for (const job of jobs) {
    const failedSteps = Array.isArray(job?.steps)
      ? job.steps.filter(step => FAILURE_CONCLUSIONS.has(step?.conclusion))
      : []
    if (failedSteps.length === 0 && FAILURE_CONCLUSIONS.has(job?.conclusion)) {
      items.push({
        label: slackText(job?.name || "Workflow job"),
        url: safeUrl(job?.html_url),
      })
    }
    for (const step of failedSteps) {
      items.push({
        label:
          slackText(job?.name || "Workflow job") +
          " › " +
          slackText(step?.name || "Failed step"),
        url: safeUrl(job?.html_url),
      })
    }
  }
  for (const check of externalChecks) {
    if (!FAILURE_CONCLUSIONS.has(check?.conclusion)) continue
    const detail = truncate(check?.output?.title || "", 160)
    items.push({
      label:
        slackText(check?.name || "External check") +
        (detail ? ": " + detail : ""),
      url: safeUrl(check?.details_url),
    })
  }
  return items
}

const linkedItem = ({ label, url }) =>
  url ? "<" + url + "|" + truncate(label, 220) + ">" : truncate(label, 220)

const latestMonitoredRuns = (workflowRuns, monitoredWorkflows) => {
  const monitored = new Set(monitoredWorkflows)
  const latest = new Map()
  for (const run of workflowRuns) {
    if (!monitored.has(run?.name) || latest.has(run.name)) continue
    latest.set(run.name, run)
  }
  return monitoredWorkflows.map(
    name => latest.get(name) || { name, status: "queued", conclusion: null },
  )
}

export const notificationDecision = ({
  checkRuns = [],
  currentHeadSha,
  currentPrState = "open",
  expectedHeadSha,
  monitoredWorkflows = [],
  scope = "pull_request",
  sourceConclusion,
  workflowRuns = [],
}) => {
  if (scope === "pull_request" && currentPrState !== "open") {
    return { notify: false, reason: "pull_request_not_open" }
  }
  if (scope === "main" && expectedHeadSha && !currentHeadSha) {
    return { notify: false, reason: "current_branch_unknown" }
  }
  if (currentHeadSha && expectedHeadSha && currentHeadSha !== expectedHeadSha) {
    return { notify: false, reason: "superseded_commit" }
  }
  if (FAILURE_CONCLUSIONS.has(sourceConclusion)) {
    return { notify: true, reason: "source_failure" }
  }
  if (monitoredWorkflows.length === 0) {
    return { notify: true, reason: "unmonitored_source" }
  }
  const runs = latestMonitoredRuns(workflowRuns, monitoredWorkflows)
  const allComplete = runs.every(run => run?.status === "completed")
  const externalChecksComplete = checkRuns
    .filter(check => check?.app?.slug !== "github-actions")
    .every(check => !check?.status || check.status === "completed")
  if (scope === "main") {
    const monitoredFailed = runs.some(run =>
      FAILURE_CONCLUSIONS.has(run?.conclusion),
    )
    const externalFailed = checkRuns
      .filter(check => check?.app?.slug !== "github-actions")
      .some(check => FAILURE_CONCLUSIONS.has(check?.conclusion))
    if (monitoredFailed) {
      return { notify: false, reason: "main_failure_already_reported" }
    }
    if (externalFailed) {
      return allComplete && externalChecksComplete
        ? { notify: true, reason: "main_external_failure" }
        : { notify: false, reason: "quality_gate_running" }
    }
    return allComplete && externalChecksComplete
      ? { notify: true, reason: "main_quality_gate_complete" }
      : { notify: false, reason: "quality_gate_running" }
  }
  if (["neutral", "skipped"].includes(sourceConclusion)) {
    return { notify: false, reason: "source_not_actionable" }
  }
  return allComplete && externalChecksComplete
    ? { notify: true, reason: "quality_gate_complete" }
    : { notify: false, reason: "quality_gate_running" }
}

export const buildSlackPayload = ({
  artifact,
  actor,
  branch,
  checkRuns = [],
  commit,
  jobResult,
  jobs = [],
  prNumber,
  prTitle,
  prUrl,
  qualityGateUrl,
  repository,
  runId,
  runUrl,
  scope = "pull_request",
  sourceWorkflow,
  monitoredWorkflows = [],
  workflowRuns = [],
}) => {
  const isMain = scope === "main"
  const ownRunFragment = "/actions/runs/" + runId
  const externalChecks = checkRuns.filter(
    check =>
      check?.app?.slug !== "github-actions" &&
      !String(check?.details_url || "").includes(ownRunFragment),
  )
  const externalFailed = externalChecks.filter(check =>
    FAILURE_CONCLUSIONS.has(check?.conclusion),
  )
  const externalPending = externalChecks.filter(
    check => check?.status && check.status !== "completed",
  )
  const monitoredRuns = latestMonitoredRuns(workflowRuns, monitoredWorkflows)
  const failedWorkflowRuns = monitoredRuns.filter(run =>
    FAILURE_CONCLUSIONS.has(run?.conclusion),
  )
  const pendingWorkflowRuns = monitoredRuns.filter(
    run => run?.status !== "completed",
  )
  const failures = [
    ...failedItems(jobs, externalChecks),
    ...failedWorkflowRuns.map(run => ({
      label: slackText(run?.name || "Workflow") + " workflow",
      url: safeUrl(run?.html_url),
    })),
  ]
  const blocked = artifact?.result === "BLOCKED"
  const sourceFailed = FAILURE_CONCLUSIONS.has(jobResult)
  const pipelineFailed =
    sourceFailed ||
    blocked ||
    failedWorkflowRuns.length > 0 ||
    externalFailed.length > 0
  const pendingCount =
    (monitoredWorkflows.length > 0 ? pendingWorkflowRuns.length : 0) +
    externalPending.length
  const state = pipelineFailed
    ? "failure"
    : pendingCount > 0
      ? "pending"
      : "success"
  const header =
    state === "failure"
      ? isMain
        ? "❌ main CI failed"
        : "❌ PR quality gate failed"
      : state === "pending"
        ? isMain
          ? "⏳ main checks still running"
          : "⏳ PR checks still running"
        : isMain
          ? "✅ main CI passed"
          : artifact?.result === "HUMAN_APPROVAL_REQUIRED"
            ? "🔐 PR ready for admin review"
            : "✅ PR ready to review"
  const passedCount =
    monitoredWorkflows.length > 0
      ? monitoredRuns.filter(run => run?.conclusion === "success").length +
        externalChecks.filter(check => check?.conclusion === "success").length
      : externalChecks.filter(check => check?.conclusion === "success").length +
        (jobResult === "success" ? 1 : 0)
  const skippedCount =
    monitoredWorkflows.length > 0
      ? monitoredRuns.filter(run =>
          ["neutral", "skipped"].includes(run?.conclusion),
        ).length +
        externalChecks.filter(check =>
          ["neutral", "skipped"].includes(check?.conclusion),
        ).length
      : externalChecks.filter(check =>
          ["neutral", "skipped"].includes(check?.conclusion),
        ).length
  const failureCount =
    monitoredWorkflows.length > 0
      ? Math.max(failedWorkflowRuns.length, sourceFailed ? 1 : 0) +
        externalFailed.length
      : externalFailed.length + (sourceFailed ? 1 : 0)
  const checksSummary =
    passedCount +
    " passed · " +
    failureCount +
    " failed · " +
    pendingCount +
    " running" +
    (skippedCount > 0 ? " · " + skippedCount + " skipped" : "")
  const consumers =
    Array.isArray(artifact?.affectedConsumers) &&
    artifact.affectedConsumers.length > 0
      ? artifact.affectedConsumers.map(slackText).join(", ")
      : "none"
  const riskSignals = Array.isArray(artifact?.riskSignals)
    ? artifact.riskSignals.map(
        signal =>
          slackText(signal?.risk || "UNKNOWN") +
          " — " +
          slackText(signal?.reason || "unspecified"),
      )
    : []
  const findings = Array.isArray(artifact?.findings)
    ? artifact.findings.map(finding => {
        const code = slackText(finding?.code || finding?.id || "UNCLASSIFIED")
        const location = slackText(finding?.path || finding?.file || "")
        return code + (location ? " · " + location : "")
      })
    : []
  const failedReadinessChecks = Array.isArray(artifact?.checks)
    ? artifact.checks
        .filter(check => Number(check?.exitCode) !== 0)
        .map(
          check =>
            slackText(check?.name || "readiness check") +
            " · exit " +
            String(check?.exitCode ?? "?"),
        )
    : []
  const environment = artifact?.environment
  const environmentCounts = artifact?.environmentCounts
  const environmentSummary = environmentCounts
    ? [
        Number(environmentCounts.runtime || 0),
        Number(environmentCounts.declared || 0),
        Number(environmentCounts.provisioned || 0),
      ].join("/")
    : environment
      ? [
          Array.isArray(environment.used) ? environment.used.length : 0,
          Array.isArray(environment.declared) ? environment.declared.length : 0,
          Array.isArray(environment.provisioned)
            ? environment.provisioned.length
            : 0,
        ].join("/")
      : "n/a"
  const actionText =
    state === "failure"
      ? isMain
        ? "The workflow failed on main. Fix the failed job or step below and rerun it."
        : "Fix the failed checks below and rerun CI. Do not merge while the quality gate is blocked."
      : state === "pending"
        ? "The main pipeline completed, but additional GitHub checks are still running."
        : isMain
          ? "All monitored workflows completed successfully on main."
          : artifact?.result === "HUMAN_APPROVAL_REQUIRED"
            ? "All automated checks passed. A repository admin must review the HIGH-risk scope before the protected merge, release or deployment."
            : "All reported checks passed. The PR is ready for review."
  const fallback =
    header +
    " · " +
    repository +
    (prNumber ? " #" + prNumber : "") +
    " · " +
    checksSummary +
    (artifact ? " · " + gateLabel(artifact) : "")
  const summaryFields = [
    {
      type: "mrkdwn",
      text:
        "*Pipeline*\n" +
        (pipelineFailed ? "❌ Failed" : "✅ Passed") +
        (isMain && !pipelineFailed
          ? " · aggregate"
          : sourceWorkflow
            ? " · " + slackText(sourceWorkflow)
            : ""),
    },
    { type: "mrkdwn", text: "*Checks*\n" + checksSummary },
  ]
  if (artifact) {
    summaryFields.splice(1, 0, {
      type: "mrkdwn",
      text:
        "*Quality gate*\n" +
        gateLabel(artifact) +
        " · " +
        slackText(artifact.risk || "unknown risk"),
    })
    summaryFields.push({
      type: "mrkdwn",
      text: "*Consumers*\n" + truncate(consumers, 160),
    })
  }
  const blocks = [
    {
      type: "header",
      text: { type: "plain_text", text: truncate(header, 150), emoji: true },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text:
            "*" +
            slackText(repository) +
            (prNumber ? " #" + slackText(prNumber) : "") +
            "* · " +
            truncate(prTitle, 120) +
            "\n" +
            CODE_TICK +
            compactSha(commit) +
            CODE_TICK +
            " · " +
            CODE_TICK +
            truncate(branch, 70) +
            CODE_TICK +
            " · by " +
            slackText(actor),
        },
      ],
    },
    {
      type: "section",
      fields: summaryFields,
    },
    { type: "section", text: { type: "mrkdwn", text: actionText } },
  ]
  if (failures.length > 0 || failedReadinessChecks.length > 0) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*What failed*\n" +
          list(
            [
              ...failures.map(linkedItem),
              ...failedReadinessChecks.map(slackText),
            ],
            8,
          ),
      },
    })
  }
  if (findings.length > 0) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Readiness findings*\n" + list(findings.map(slackText), 6),
      },
    })
  } else if (artifact) {
    blocks.push({
      type: "context",
      elements: [{ type: "mrkdwn", text: "✅ No new readiness findings" }],
    })
  }
  if (riskSignals.length > 0) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Risk signals*\n" + list(riskSignals.map(slackText), 5),
      },
    })
  }
  if (artifact) {
    blocks.push({
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text:
            "Environment contract counts (runtime/declared/provisioned): *" +
            environmentSummary +
            "*. Names and values are not sent to Slack.",
        },
      ],
    })
  }
  const actions = []
  const safePrUrl = safeUrl(prUrl)
  const safeRunUrl = safeUrl(runUrl)
  const safeQualityGateUrl = safeUrl(qualityGateUrl)
  if (safePrUrl) {
    actions.push({
      type: "button",
      text: {
        type: "plain_text",
        text: isMain ? "Open merged PR" : "Open PR",
      },
      url: safePrUrl,
    })
  }
  if (safeRunUrl) {
    actions.push({
      type: "button",
      text: { type: "plain_text", text: "Open workflow" },
      url: safeRunUrl,
    })
  }
  if (safeQualityGateUrl) {
    actions.push({
      type: "button",
      text: { type: "plain_text", text: "Quality gate" },
      url: safeQualityGateUrl,
    })
  }
  if (actions.length > 0) blocks.push({ type: "actions", elements: actions })

  return {
    text: fallback,
    blocks,
    unfurl_links: false,
    unfurl_media: false,
  }
}

const githubRequest = async (path, token) => {
  if (!token) return null
  const response = await fetch("https://api.github.com" + path, {
    headers: {
      accept: "application/vnd.github+json",
      authorization: "Bearer " + token,
      "x-github-api-version": "2022-11-28",
    },
    signal: AbortSignal.timeout(10_000),
  })
  if (!response.ok) throw new Error("github_api_" + response.status)
  return response.json()
}

const readArtifact = path => {
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, "utf8"))
  } catch {
    return null
  }
}

export const artifactFromQualityGateComment = (body, expectedCommit) => {
  const source = String(body || "")
  const start = source.indexOf(COMMENT_DATA_PREFIX)
  if (start < 0) return null
  const encodedStart = start + COMMENT_DATA_PREFIX.length
  const encodedEnd = source.indexOf(" -->", encodedStart)
  if (encodedEnd < 0) return null
  try {
    const artifact = JSON.parse(
      Buffer.from(source.slice(encodedStart, encodedEnd), "base64url").toString(
        "utf8",
      ),
    )
    if (artifact?.schemaVersion !== 1) return null
    if (expectedCommit && artifact?.commit !== expectedCommit) return null
    return artifact
  } catch {
    return null
  }
}

const main = async () => {
  const slackToken = process.env.SLACK_BOT_TOKEN
  const channel = process.env.SLACK_CHANNEL_ID_CICD
  if (!slackToken || !channel) {
    process.stdout.write(
      "::warning title=Slack notification skipped::SLACK_BOT_TOKEN or SLACK_CHANNEL_ID_CICD is unavailable.\n",
    )
    return
  }

  const repository = process.env.GITHUB_REPOSITORY || "unknown/unknown"
  const runId = process.env.SOURCE_RUN_ID || process.env.GITHUB_RUN_ID || ""
  let prNumber = process.env.PR_NUMBER || ""
  const headSha =
    process.env.SOURCE_HEAD_SHA ||
    process.env.PR_HEAD_SHA ||
    process.env.GITHUB_SHA ||
    ""
  const token = process.env.GITHUB_TOKEN || ""
  const sourceEvent = process.env.SOURCE_EVENT || "pull_request"
  const scope =
    prNumber || sourceEvent === "pull_request" ? "pull_request" : "main"
  if (!prNumber && scope === "main") {
    const associatedPullRequests = await githubRequest(
      "/repos/" +
        repository +
        "/commits/" +
        encodeURIComponent(headSha) +
        "/pulls?per_page=10",
      token,
    ).catch(() => [])
    const pullRequest = Array.isArray(associatedPullRequests)
      ? associatedPullRequests.find(candidate => candidate?.merged_at) ||
        associatedPullRequests[0]
      : null
    prNumber = pullRequest?.number ? String(pullRequest.number) : ""
  }
  const monitoredWorkflows = (() => {
    try {
      const source =
        scope === "main"
          ? process.env.MAIN_MONITORED_WORKFLOWS
          : process.env.MONITORED_WORKFLOWS
      const value = JSON.parse(source || "[]")
      return Array.isArray(value) ? value.map(String) : []
    } catch {
      return []
    }
  })()
  const [
    jobsResult,
    checksResult,
    commentsResult,
    runsResult,
    pullRequestResult,
    branchResult,
  ] = await Promise.allSettled([
    githubRequest(
      "/repos/" + repository + "/actions/runs/" + runId + "/jobs?per_page=100",
      token,
    ),
    githubRequest(
      "/repos/" +
        repository +
        "/commits/" +
        headSha +
        "/check-runs?per_page=100",
      token,
    ),
    prNumber
      ? githubRequest(
          "/repos/" +
            repository +
            "/issues/" +
            prNumber +
            "/comments?per_page=100",
          token,
        )
      : Promise.resolve(null),
    githubRequest(
      "/repos/" +
        repository +
        "/actions/runs?head_sha=" +
        encodeURIComponent(headSha) +
        "&per_page=100",
      token,
    ),
    prNumber
      ? githubRequest("/repos/" + repository + "/pulls/" + prNumber, token)
      : Promise.resolve(null),
    scope === "main"
      ? githubRequest(
          "/repos/" +
            repository +
            "/branches/" +
            encodeURIComponent(process.env.SOURCE_BRANCH || "main"),
          token,
        )
      : Promise.resolve(null),
  ])
  const jobs =
    jobsResult.status === "fulfilled" ? jobsResult.value?.jobs || [] : []
  const checkRuns =
    checksResult.status === "fulfilled"
      ? checksResult.value?.check_runs || []
      : []
  const comments =
    commentsResult.status === "fulfilled" && Array.isArray(commentsResult.value)
      ? commentsResult.value
      : []
  const workflowRuns =
    runsResult.status === "fulfilled"
      ? runsResult.value?.workflow_runs || []
      : []
  const pullRequest =
    pullRequestResult.status === "fulfilled" ? pullRequestResult.value : null
  const branch = branchResult.status === "fulfilled" ? branchResult.value : null
  const sourceConclusion =
    process.env.SOURCE_CONCLUSION || process.env.PIPELINE_RESULT || "failure"
  const decision = notificationDecision({
    checkRuns,
    currentHeadSha:
      scope === "main" ? branch?.commit?.sha : pullRequest?.head?.sha,
    currentPrState: pullRequest?.state,
    expectedHeadSha: headSha,
    monitoredWorkflows,
    scope,
    sourceConclusion,
    workflowRuns,
  })
  if (!decision.notify) {
    process.stdout.write(
      "Slack CI quality-gate notification skipped: " + decision.reason + ".\n",
    )
    return
  }
  const qualityGate = comments.find(
    comment =>
      comment?.user?.login === "github-actions[bot]" &&
      String(comment?.body || "").includes(
        "<!-- prokodo-production-readiness -->",
      ),
  )
  const runUrl =
    (process.env.GITHUB_SERVER_URL || "https://github.com") +
    "/" +
    repository +
    "/actions/runs/" +
    runId
  const payload = buildSlackPayload({
    artifact:
      readArtifact(
        resolve(
          process.env.READINESS_ARTIFACT ||
            ".prokodo/artifacts/production-readiness.json",
        ),
      ) ||
      artifactFromQualityGateComment(
        qualityGate?.body,
        pullRequest?.head?.sha || headSha,
      ),
    actor:
      pullRequest?.user?.login ||
      process.env.SOURCE_ACTOR ||
      process.env.PR_AUTHOR ||
      process.env.GITHUB_ACTOR ||
      "unknown",
    branch:
      (scope === "main" ? process.env.SOURCE_BRANCH : pullRequest?.head?.ref) ||
      process.env.PR_HEAD_REF ||
      "",
    checkRuns,
    commit: headSha,
    jobResult: sourceConclusion,
    jobs,
    monitoredWorkflows,
    prNumber,
    prTitle:
      pullRequest?.title ||
      (scope === "main"
        ? process.env.SOURCE_TITLE || "Direct update on main"
        : process.env.PR_TITLE || "Untitled pull request"),
    prUrl: pullRequest?.html_url || process.env.PR_URL,
    qualityGateUrl: qualityGate?.html_url,
    repository,
    runId,
    runUrl,
    scope,
    sourceWorkflow: process.env.SOURCE_WORKFLOW || "",
    workflowRuns,
  })
  const response = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      authorization: "Bearer " + slackToken,
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ channel, ...payload }),
    signal: AbortSignal.timeout(10_000),
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok || result.ok !== true) {
    throw new Error(
      "slack_api_" + (result.error || String(response.status || "unknown")),
    )
  }
  process.stdout.write("Slack CI quality-gate notification sent.\n")
}

if (resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    process.stderr.write(
      "::warning title=Slack notification failed::" +
        (error instanceof Error ? error.message : "unknown_error") +
        "\n",
    )
  })
}
