import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

export const COMMENT_MARKER = "<!-- prokodo-production-readiness -->"

const RESULT_COPY = Object.freeze({
  PASS: {
    icon: "✅",
    title: "Ready",
    explanation: "All automated production-readiness gates passed.",
  },
  PASS_WITH_ADVISORIES: {
    icon: "⚠️",
    title: "Passed with advisories",
    explanation:
      "Automated gates passed with advisories. Review them before merge; autonomous merge is not permitted.",
  },
  HUMAN_APPROVAL_REQUIRED: {
    icon: "🛑",
    title: "Human approval required",
    explanation:
      "This is an intentional policy stop for a high-risk change, not an unclassified test failure. Exit code 20 requires a human decision.",
  },
  BLOCKED: {
    icon: "❌",
    title: "Blocked",
    explanation:
      "A blocking readiness finding or harness failure was detected. Do not merge this commit.",
  },
})

const inline = value =>
  String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/gu, " ")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("|", "&#124;")
    .replaceAll("`", "&#96;")
    .trim()

const compactSha = value => {
  const sha = String(value ?? "unknown")
  return /^[0-9a-f]{7,64}$/iu.test(sha) ? sha.slice(0, 12) : inline(sha)
}

const safeUrl = value => {
  try {
    const url = new URL(String(value))
    return ["https:", "http:"].includes(url.protocol) ? url.href : null
  } catch {
    return null
  }
}

const list = (values, emptyMessage, limit = 100) => {
  if (!Array.isArray(values) || values.length === 0) return `- ${emptyMessage}`
  const visible = values.slice(0, limit)
  const remaining = values.length - visible.length
  return [
    ...visible.map(value => `- ${inline(value)}`),
    remaining > 0 ? `- … ${remaining} additional entries omitted` : null,
  ]
    .filter(Boolean)
    .join("\n")
}

const reviewChecklist = classes => {
  const values = new Set(Array.isArray(classes) ? classes : [])
  const items = [
    "Confirm the goal, changed-file scope, and engineering contract are accurate.",
    "Confirm no test, scanner, coverage, or security gate was weakened or suppressed.",
  ]
  if (values.has("deployment")) {
    items.push(
      "Review workflow permissions, deployment triggers, and protected-environment boundaries.",
    )
  }
  if (values.has("env")) {
    items.push(
      "Confirm only environment names/references changed and no secret value is present.",
    )
  }
  if (values.has("infrastructure") || values.has("terraform")) {
    items.push(
      "Confirm there is no production apply, destructive operation, IAM expansion, or state mutation.",
    )
  }
  if (values.has("security")) {
    items.push(
      "Review trust-boundary and security-sensitive changes against the repository risk contract.",
    )
  }
  if (values.has("package_dependencies")) {
    items.push(
      "Review dependency and runtime metadata changes for supply-chain impact.",
    )
  }
  return items.map(item => `- [ ] ${item}`).join("\n")
}

const renderChecks = checks => {
  if (!Array.isArray(checks) || checks.length === 0) {
    return "_No repository-specific readiness checks were recorded._"
  }
  return [
    "| Check | Directory | Exit code |",
    "|---|---|---:|",
    ...checks.slice(0, 50).map(check => {
      const exitCode = Number.isInteger(check?.exitCode) ? check.exitCode : "?"
      const state = exitCode === 0 ? "✅" : "❌"
      return `| ${state} ${inline(check?.name || "unnamed")} | ${inline(check?.directory || "—")} | ${exitCode} |`
    }),
  ].join("\n")
}

const renderFindings = findings => {
  if (!Array.isArray(findings) || findings.length === 0) {
    return "✅ No new readiness findings."
  }
  return [
    "| Severity | Finding | Location |",
    "|---|---|---|",
    ...findings.slice(0, 50).map(finding => {
      const identifier = finding?.code || finding?.id || "UNCLASSIFIED"
      const location = finding?.path || finding?.file || "—"
      return `| ${inline(finding?.severity || "unknown")} | ${inline(identifier)} | ${inline(location)} |`
    }),
  ].join("\n")
}

const environmentSummary = environment => {
  const drift = environment?.preExistingDriftCounts ?? {}
  const count = value => (Array.isArray(value) ? value.length : 0)
  return [
    `- Runtime names detected: **${count(environment?.used)}**`,
    `- Declared names detected: **${count(environment?.declared)}**`,
    `- Provisioned names detected: **${count(environment?.provisioned)}**`,
    `- Pre-existing missing declarations: **${Number(drift.missing ?? 0)}**`,
    `- Pre-existing documented/provisioned drift: **${Number(drift.documentedUnused ?? 0)}/${Number(drift.provisionedUnused ?? 0)}**`,
    `- Pre-existing public-name exposure count: **${Number(drift.publicSecretExposure ?? 0)}**`,
    "",
    "_Only names were inspected. Environment and secret values are never included in this comment._",
  ].join("\n")
}

export const renderReadinessComment = (
  artifact,
  { commit = "unknown", repository = artifact?.repository, runUrl = null } = {},
) => {
  if (!artifact || typeof artifact !== "object") {
    throw new Error("readiness_artifact_must_be_an_object")
  }
  if (!RESULT_COPY[artifact.result]) {
    throw new Error("readiness_artifact_result_invalid")
  }
  if (!["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(artifact.risk)) {
    throw new Error("readiness_artifact_risk_invalid")
  }

  const copy = RESULT_COPY[artifact.result]
  const run = safeUrl(runUrl)
  const changedFiles = Array.isArray(artifact.changedFiles)
    ? artifact.changedFiles
    : []
  const riskSignals = Array.isArray(artifact.riskSignals)
    ? artifact.riskSignals.map(
        signal =>
          `${signal?.risk || "UNKNOWN"} — ${signal?.reason || "unspecified"}`,
      )
    : []
  const approvalText =
    artifact.result === "HUMAN_APPROVAL_REQUIRED"
      ? [
          `Review and approve **exact commit \`${compactSha(commit)}\`**.`,
          "A new commit invalidates this approval and requires a fresh review.",
          "After approval, an authorized human may perform the protected merge.",
        ].join(" ")
      : artifact.result === "BLOCKED"
        ? "Do not approve or merge. Resolve the findings and run validation again."
        : "Follow the repository merge policy after all required GitHub checks complete."

  return [
    COMMENT_MARKER,
    `## ${copy.icon} Production readiness · ${copy.title}`,
    "",
    `> ${copy.explanation}`,
    "",
    "| Repository | Result | Risk | Commit | Base |",
    "|---|---|---|---|---|",
    `| ${inline(repository || "unknown")} | **${inline(artifact.result)}** | **${inline(artifact.risk)}** | \`${compactSha(commit)}\` | \`${compactSha(artifact.base)}\` |`,
    "",
    run ? `[🔎 Open the complete workflow run](${run})` : "",
    "",
    "### Why this decision was made",
    "",
    list(riskSignals, "No explicit risk signal was recorded.", 20),
    "",
    "### Automated evidence",
    "",
    "✅ All preceding verification steps in this CI job completed successfully.",
    "",
    renderFindings(artifact.findings),
    "",
    renderChecks(artifact.checks),
    "",
    `Affected consumers: **${Array.isArray(artifact.affectedConsumers) && artifact.affectedConsumers.length > 0 ? artifact.affectedConsumers.map(inline).join(", ") : "none"}**`,
    "",
    "<details>",
    `<summary>Environment contract summary (names only)</summary>`,
    "",
    environmentSummary(artifact.environment),
    "",
    "</details>",
    "",
    "<details>",
    `<summary>Changed files (${changedFiles.length})</summary>`,
    "",
    list(changedFiles, "No changed files were recorded."),
    "",
    "</details>",
    "",
    "### Human review checklist",
    "",
    reviewChecklist(artifact.changeClasses),
    "",
    "### Required action",
    "",
    approvalText,
    "",
    "_Generated automatically from the versioned production-readiness artifact. The JSON artifact remains the machine-readable source of truth._",
  ]
    .filter((line, index, lines) => line !== "" || lines[index - 1] !== "")
    .join("\n")
}

export const renderUnavailableComment = ({
  commit,
  repository,
  runUrl,
  reason,
}) => {
  const run = safeUrl(runUrl)
  return [
    COMMENT_MARKER,
    "## ❌ Production readiness · Artifact unavailable",
    "",
    "> Production readiness could not be evaluated from a valid artifact. Treat this commit as blocked.",
    "",
    `- Repository: **${inline(repository || "unknown")}**`,
    `- Commit: \`${compactSha(commit)}\``,
    `- Reason: ${inline(reason || "unknown")}`,
    run ? `- [Open the workflow run](${run})` : "",
    "",
    "### Required action",
    "",
    "Do not approve or merge. Repair the validation run and generate a valid readiness artifact.",
  ].join("\n")
}

const parseCli = argv => {
  const options = {}
  const remaining = [...argv]
  while (remaining.length > 0) {
    const name = remaining.shift()
    if (
      ![
        "--input",
        "--output",
        "--commit",
        "--repository",
        "--run-url",
      ].includes(name)
    ) {
      throw new Error(`unsupported_argument:${name}`)
    }
    const value = remaining.shift()
    if (!value) throw new Error(`missing_value:${name}`)
    options[name.slice(2).replace("-u", "U")] = value
  }
  return options
}

const main = () => {
  let options = {}
  try {
    options = parseCli(process.argv.slice(2))
    const input = resolve(
      options.input || ".prokodo/artifacts/production-readiness.json",
    )
    const output = resolve(
      options.output || ".prokodo/artifacts/production-readiness-comment.md",
    )
    if (!existsSync(input)) throw new Error("readiness_artifact_missing")
    const artifact = JSON.parse(readFileSync(input, "utf8"))
    writeFileSync(
      output,
      `${renderReadinessComment(artifact, options)}\n`,
      "utf8",
    )
  } catch (error) {
    const output = resolve(
      options.output || ".prokodo/artifacts/production-readiness-comment.md",
    )
    writeFileSync(
      output,
      `${renderUnavailableComment({
        ...options,
        reason: error instanceof Error ? error.message : "unknown_error",
      })}\n`,
      "utf8",
    )
    process.exitCode = 1
  }
}

if (resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) main()
