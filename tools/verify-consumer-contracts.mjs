#!/usr/bin/env node
import { spawnSync } from "node:child_process"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const EXIT = {
  PASS: 0,
  PASS_WITH_ADVISORIES: 10,
  HUMAN_APPROVAL_REQUIRED: 20,
  BLOCKED: 30,
}
const CONSUMERS = ["prokodo-portal", "prokodo-website"]

const stableObject = value =>
  JSON.stringify(value ?? {}, Object.keys(value ?? {}).sort())

const isRuntimeSource = path =>
  path.startsWith("src/") &&
  !/(?:^|\/)(?:__tests__|tests)(?:\/|$)/u.test(path) &&
  !/\.(?:test|spec|stories)\.[cm]?[jt]sx?$/u.test(path)

export const compareConsumerContracts = ({
  current,
  baseline,
  changedFiles,
}) => {
  const findings = []
  const currentExports = new Set(Object.keys(current.exports ?? {}))
  const baselineExports = new Set(Object.keys(baseline.exports ?? {}))
  const addedExports = [...currentExports]
    .filter(value => !baselineExports.has(value))
    .sort()
  const removedExports = [...baselineExports]
    .filter(value => !currentExports.has(value))
    .sort()
  const peerDependenciesChanged =
    stableObject(current.peerDependencies) !==
    stableObject(baseline.peerDependencies)
  const versionValid = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u.test(
    current.version ?? "",
  )
  const sourceChanged = changedFiles.some(isRuntimeSource)
  const publicContractChanged =
    sourceChanged ||
    addedExports.length > 0 ||
    removedExports.length > 0 ||
    peerDependenciesChanged
  const changesetPresent = changedFiles.some(path =>
    /^\.changeset\/[^/]+\.md$/u.test(path),
  )
  const changeType =
    removedExports.length > 0 || peerDependenciesChanged
      ? "breaking"
      : addedExports.length > 0
        ? "additive"
        : sourceChanged
          ? "behavioral"
          : "none"

  if (!versionValid)
    findings.push({ code: "INVALID_SEMVER", severity: "error" })
  if (removedExports.length > 0)
    findings.push({
      code: "PUBLIC_EXPORT_REMOVED",
      severity: "high",
      exports: removedExports,
    })
  if (peerDependenciesChanged)
    findings.push({ code: "PEER_DEPENDENCIES_CHANGED", severity: "high" })
  if (publicContractChanged && !changesetPresent)
    findings.push({ code: "CHANGESET_REQUIRED", severity: "error" })

  const result = findings.some(finding => finding.severity === "error")
    ? "BLOCKED"
    : changeType === "breaking"
      ? "HUMAN_APPROVAL_REQUIRED"
      : findings.length > 0
        ? "PASS_WITH_ADVISORIES"
        : "PASS"
  return {
    result,
    changeType,
    version: current.version,
    addedExports,
    removedExports,
    peerDependenciesChanged,
    changesetPresent,
    affectedConsumers: publicContractChanged ? CONSUMERS : [],
    findings,
  }
}

const runGit = (root, args, allowFailure = false) => {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8" })
  if (result.status !== 0 && !allowFailure)
    throw new Error(`git_${args[0]}_failed`)
  return result.status === 0 ? result.stdout : ""
}

const main = () => {
  const root = resolve(import.meta.dirname, "..")
  const baseIndex = process.argv.indexOf("--base")
  const requestedBase = baseIndex >= 0 ? process.argv[baseIndex + 1] : null
  const base =
    requestedBase ??
    (runGit(root, ["rev-parse", "--verify", "origin/main^{commit}"], true)
      ? "origin/main"
      : "main")
  const current = JSON.parse(
    readFileSync(resolve(root, "package.json"), "utf8"),
  )
  const baselineRaw = runGit(root, ["show", `${base}:package.json`], true)
  const baseline = baselineRaw === "" ? current : JSON.parse(baselineRaw)
  const changedFiles = [
    ...runGit(
      root,
      ["diff", "--name-only", "--diff-filter=ACDMRTUXB", `${base}...HEAD`],
      true,
    ).split(/\r?\n/u),
    ...runGit(
      root,
      ["diff", "--name-only", "--diff-filter=ACDMRTUXB"],
      true,
    ).split(/\r?\n/u),
    ...runGit(
      root,
      ["diff", "--cached", "--name-only", "--diff-filter=ACDMRTUXB"],
      true,
    ).split(/\r?\n/u),
    ...runGit(root, ["ls-files", "--others", "--exclude-standard"], true).split(
      /\r?\n/u,
    ),
  ].filter(Boolean)
  const result = compareConsumerContracts({
    current,
    baseline,
    changedFiles: [...new Set(changedFiles)],
  })
  const artifact = {
    schemaVersion: 1,
    repository: "prokodo-ui",
    base,
    ...result,
  }
  const path = resolve(root, ".prokodo/artifacts/consumer-contract.json")
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, `${JSON.stringify(artifact, null, 2)}\n`, { mode: 0o600 })
  process.stdout.write(`${JSON.stringify(artifact, null, 2)}\n`)
  process.exitCode = EXIT[result.result]
}

if (
  process.argv[1] !== undefined &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main()
