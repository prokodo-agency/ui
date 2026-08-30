import { readFileSync } from "node:fs"
import { extname, resolve } from "node:path"
import { spawnSync } from "node:child_process"

export const RESULT_EXIT_CODES = Object.freeze({
  PASS: 0,
  PASS_WITH_ADVISORIES: 10,
  HUMAN_APPROVAL_REQUIRED: 20,
  BLOCKED: 30,
})

export const FAILURE_CLASSIFICATIONS = Object.freeze([
  "PRODUCT_BUG",
  "REGRESSION",
  "WRONG_TEST",
  "FLAKY",
  "HARNESS",
  "ENVIRONMENT",
  "EXTERNAL_SERVICE",
])

const RISK_RANK = Object.freeze({ LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 })
const TEXT_EXTENSIONS = new Set([
  ".cjs",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".mjs",
  ".mts",
  ".scss",
  ".sh",
  ".tf",
  ".ts",
  ".tsx",
  ".yaml",
  ".yml",
])
const CREDENTIAL_PATH =
  /(?:^|\/)(?:credentials?|service[-_]?account)[^/]*\.json$|(?:^|\/)(?:id_rsa|[^/]+\.(?:pem|key|p12|pfx))$|\.tfvars(?:\.json)?$/iu
const SECRET_LIKE_NAME =
  /(?:SECRET|TOKEN|PASSWORD|PRIVATE|HMAC|CREDENTIAL|API_KEY)/u
const HIGH_CLASS = new Set([
  "auth",
  "billing",
  "deployment",
  "env",
  "infrastructure",
  "migrations",
  "security",
  "terraform",
])
const INFRASTRUCTURE_DEPENDENCIES = Object.freeze([
  {
    name: "cloud_tasks",
    source: /@google-cloud\/tasks|\bCloudTasksClient\b/u,
    declaration: /google_cloud_tasks_queue|cloudtasks\.googleapis\.com/u,
  },
  {
    name: "cloud_scheduler",
    source: /@google-cloud\/scheduler|\bCloudSchedulerClient\b/u,
    declaration: /google_cloud_scheduler_job|cloudscheduler\.googleapis\.com/u,
  },
  {
    name: "pubsub",
    source: /@google-cloud\/pubsub|\bPubSub\b/u,
    declaration:
      /google_pubsub_(?:topic|subscription)|pubsub\.googleapis\.com/u,
  },
  {
    name: "cloud_storage",
    source: /@google-cloud\/storage|\bnew\s+Storage\s*\(/u,
    declaration: /google_storage_bucket|storage\.googleapis\.com/u,
  },
  {
    name: "firestore",
    source:
      /@google-cloud\/firestore|firebase-admin\/firestore|\bgetFirestore\s*\(/u,
    declaration:
      /google_firestore_(?:database|index)|firestore\.(?:indexes|rules)|firestore\.googleapis\.com/u,
  },
  {
    name: "cloud_sql",
    source: /@google-cloud\/cloud-sql-connector|\bCloudSQLConnector\b/u,
    declaration:
      /google_sql_(?:database|database_instance|user)|sqladmin\.googleapis\.com/u,
  },
])

const uniqueSorted = values => [...new Set(values)].sort()

const runGit = (root, args, allowFailure = false) => {
  const result = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  })
  if (result.status !== 0 && !allowFailure) {
    throw new Error(`git_${args[0]}_failed`)
  }
  return result.status === 0 ? result.stdout : ""
}

export const parseArguments = argv => {
  const options = { base: null, json: null, terraformPlanJson: null }
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]
    if (value === "--base") options.base = argv[++index] ?? null
    else if (value === "--json") options.json = argv[++index] ?? null
    else if (value === "--terraform-plan-json") {
      options.terraformPlanJson = argv[++index] ?? null
    } else throw new Error(`unsupported_argument:${value}`)
  }
  return options
}

export const resolveBase = (root, requested) => {
  const candidates = [requested, "origin/main", "main", "HEAD~1"].filter(
    Boolean,
  )
  for (const candidate of candidates) {
    const result = spawnSync(
      "git",
      ["rev-parse", "--verify", `${candidate}^{commit}`],
      {
        cwd: root,
        encoding: "utf8",
      },
    )
    if (result.status === 0) return candidate
  }
  throw new Error("validation_base_not_found")
}

export const listRepositoryFiles = root =>
  uniqueSorted(
    runGit(root, [
      "ls-files",
      "--cached",
      "--others",
      "--exclude-standard",
      "-z",
    ])
      .split("\0")
      .filter(Boolean),
  )

export const listChangedFiles = (root, base) => {
  const commands = [
    ["diff", "--name-only", "--diff-filter=ACDMRTUXB", `${base}...HEAD`],
    ["diff", "--name-only", "--diff-filter=ACDMRTUXB"],
    ["diff", "--cached", "--name-only", "--diff-filter=ACDMRTUXB"],
    ["ls-files", "--others", "--exclude-standard"],
  ]
  return uniqueSorted(
    commands.flatMap(args =>
      runGit(root, args, true).split(/\r?\n/u).filter(Boolean),
    ),
  )
}

const safeDiffFor = (root, base, path) => {
  if (CREDENTIAL_PATH.test(path) || /(?:^|\/)\.env(?:\.|$)/u.test(path))
    return ""
  const committed = runGit(
    root,
    ["diff", "--unified=0", `${base}...HEAD`, "--", path],
    true,
  )
  const working = runGit(root, ["diff", "--unified=0", "--", path], true)
  const staged = runGit(
    root,
    ["diff", "--cached", "--unified=0", "--", path],
    true,
  )
  const tracked = runGit(
    root,
    ["ls-files", "--error-unmatch", "--", path],
    true,
  )
  let untracked = ""
  if (tracked === "" && TEXT_EXTENSIONS.has(extname(path))) {
    try {
      untracked = readFileSync(resolve(root, path), "utf8")
        .split(/\r?\n/u)
        .map(line => `+${line}`)
        .join("\n")
    } catch {
      // A concurrently removed file has no untracked diff to inspect.
    }
  }
  return `${committed}\n${working}\n${staged}\n${untracked}`
}

export const classifyChanges = paths => {
  const classes = new Set()
  for (const path of paths) {
    const lower = path.toLowerCase()
    if (/^(?:docs\/|agents\.md$)|\.md$/u.test(lower)) classes.add("docs")
    if (
      /(?:^|\/)(?:test|tests|__tests__|cypress)(?:\/|$)|\.(?:spec|test)\.[cm]?[jt]sx?$/u.test(
        lower,
      )
    )
      classes.add("tests")
    if (
      /\.(?:css|scss|sass|tsx|jsx)$|(?:^|\/)(?:components?|storybook|stories|cypress)(?:\/|$)/u.test(
        lower,
      )
    )
      classes.add("ui")
    if (/(?:^|\/)(?:api|routes?|openapi)(?:\/|$)/u.test(lower))
      classes.add("api")
    if (
      /(?:auth|authorization|mfa|passkey|totp|tenant|firestore\.rules)/u.test(
        lower,
      )
    )
      classes.add("auth")
    if (/(?:stripe|billing|payment|refund|invoice|checkout)/u.test(lower))
      classes.add("billing")
    if (/(?:^|\/)(?:infrastructure|terraform)(?:\/|$)|\.tf$/u.test(lower)) {
      classes.add("infrastructure")
      classes.add("terraform")
    }
    if (/(?:^|\/)(?:migrations?|schema)(?:\/|$)/u.test(lower))
      classes.add("migrations")
    if (
      /(?:\.env|environment|env-vars|vercel\.json|firebase\.json)/u.test(lower)
    )
      classes.add("env")
    if (
      /(?:^|\/)\.github\/workflows\/|dockerfile|vercel\.json|firebase\.json/u.test(
        lower,
      )
    )
      classes.add("deployment")
    if (/(?:security|iam|kms|secret|hmac|webhook)/u.test(lower))
      classes.add("security")
    if (
      /(?:jira.*oauth|oauth.*jira|tokens?|pii|account.?delet|data.?retention)/u.test(
        lower,
      )
    ) {
      classes.add("security")
    }
    if (
      /(?:scheduler|queues?|worker.?roles?|domains?|ingress|cloud.?run|cloud.?sql|pub.?sub|firestore.(?:indexes|rules))/u.test(
        lower,
      )
    ) {
      classes.add("infrastructure")
    }
    if (
      /(?:contract|openapi|schema|\.prokodo\/engineering-contract)/u.test(lower)
    )
      classes.add("contracts")
    if (
      /(?:^|\/)package\.json$|(?:pnpm|package)-lock\.(?:yaml|json)$/u.test(
        lower,
      )
    )
      classes.add("package_dependencies")
    if (/(?:^|\/)src\//u.test(lower)) classes.add("source")
    if (/(?:copy|translations?|locales?)/u.test(lower)) classes.add("copy")
  }
  if (classes.size === 0 && paths.length > 0) classes.add("source")
  return uniqueSorted(classes)
}

const matchesConfiguredPattern = (path, pattern) => {
  try {
    return new RegExp(pattern, "iu").test(path)
  } catch {
    return false
  }
}

const elevate = (current, candidate) =>
  RISK_RANK[candidate] > RISK_RANK[current] ? candidate : current

export const determineRisk = ({
  paths,
  classes,
  contract,
  diffs = new Map(),
}) => {
  let risk = paths.length === 0 ? "LOW" : "MEDIUM"
  const signals = []
  if (
    classes.length > 0 &&
    classes.every(value => ["copy", "docs", "tests"].includes(value))
  ) {
    risk = "LOW"
  }
  for (const changeClass of classes) {
    if (HIGH_CLASS.has(changeClass)) {
      risk = elevate(risk, "HIGH")
      signals.push({ risk: "HIGH", reason: `change_class:${changeClass}` })
    }
  }
  for (const rule of contract.riskPaths ?? []) {
    if (
      paths.some(path =>
        (rule.patterns ?? []).some(pattern =>
          matchesConfiguredPattern(path, pattern),
        ),
      )
    ) {
      risk = elevate(risk, rule.risk)
      signals.push({ risk: rule.risk, reason: rule.reason })
    }
  }
  for (const path of paths) {
    if (CREDENTIAL_PATH.test(path)) {
      risk = "CRITICAL"
      signals.push({ risk: "CRITICAL", reason: "credential_path_changed" })
    }
    const policyImplementation =
      path.startsWith("scripts/autonomy/") || path.startsWith(".prokodo/")
    const diff = policyImplementation ? "" : (diffs.get(path) ?? "")
    const added = diff
      .split(/\r?\n/u)
      .filter(line => line.startsWith("+") && !line.startsWith("+++"))
      .join("\n")
    const removed = diff
      .split(/\r?\n/u)
      .filter(line => line.startsWith("-") && !line.startsWith("---"))
      .join("\n")
    if (
      /(?:it|test|describe)\.skip\s*\(|continue-on-error:\s*true|exit-code:\s*["']?0/u.test(
        added,
      )
    ) {
      risk = "CRITICAL"
      signals.push({ risk: "CRITICAL", reason: "required_gate_weakening" })
    }
    if (
      /\bexpect\s*\(|\bassert(?:\.|\s*\()/u.test(removed) &&
      /(?:test|spec)\.[cm]?[jt]sx?$/u.test(path)
    ) {
      risk = "CRITICAL"
      signals.push({ risk: "CRITICAL", reason: "test_assertion_removed" })
    }
    if (
      /terraform\s+apply|(?:^|\s)-auto-approve|google_service_account_key/u.test(
        added,
      )
    ) {
      risk = "CRITICAL"
      signals.push({
        risk: "CRITICAL",
        reason: "production_or_key_operation_added",
      })
    }
    if (
      /(?:google_(?:project|service_account)_iam_(?:member|binding|policy)|roles\/owner)/u.test(
        added,
      )
    ) {
      risk = "CRITICAL"
      signals.push({ risk: "CRITICAL", reason: "iam_expansion_added" })
    }
    if (
      /(?:google_secret_manager_secret_version|\bsecret_data\s*=|\brandom_password\b|\btls_private_key\b)/u.test(
        added,
      )
    ) {
      risk = "CRITICAL"
      signals.push({ risk: "CRITICAL", reason: "secret_value_operation_added" })
    }
    if (
      /(?:migration|schema)/u.test(path) &&
      /\b(?:DROP\s+(?:TABLE|COLUMN)|TRUNCATE|DELETE\s+FROM)\b|\.dropColumn\s*\(/iu.test(
        added,
      )
    ) {
      risk = "CRITICAL"
      signals.push({ risk: "CRITICAL", reason: "irreversible_migration_added" })
    }
  }
  return { risk, signals: deduplicateSignals(signals) }
}

const deduplicateSignals = signals => {
  const seen = new Set()
  return signals.filter(signal => {
    const key = `${signal.risk}:${signal.reason}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const allowlisted = (name, entries = []) =>
  entries.some(
    entry =>
      entry.name === name ||
      (typeof entry.pattern === "string" &&
        matchesConfiguredPattern(name, entry.pattern)),
  )

const extractUsedNames = content => {
  const names = []
  const patterns = [
    /process\.env\.([A-Z][A-Z0-9_]*)/gu,
    /process\.env\[["']([A-Z][A-Z0-9_]*)["']\]/gu,
    /define(?:Secret|String)\(\s*["']([A-Z][A-Z0-9_]*)["']/gu,
    /\benv(?:\.(?:int|bool|array|json))?\(\s*["']([A-Z][A-Z0-9_]*)["']/gu,
  ]
  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) names.push(match[1])
  }
  for (const match of content.matchAll(/\{([^}]+)\}\s*=\s*process\.env/gu)) {
    for (const name of match[1].match(/[A-Z][A-Z0-9_]*/gu) ?? [])
      names.push(name)
  }
  return names
}

const extractDeclaredNames = (path, content) => {
  const names = []
  if (/(?:^|\/)\.env(?:\.example|\.sample|\.template)?$/u.test(path)) {
    for (const line of content.split(/\r?\n/u)) {
      const match = /^\s*(?:export\s+)?([A-Z][A-Z0-9_]*)\s*=/u.exec(line)
      if (match) names.push(match[1])
    }
  } else if (path.endsWith(".md")) {
    for (const match of content.matchAll(/`([A-Z][A-Z0-9_]{2,})`/gu))
      names.push(match[1])
  }
  return names
}

const extractProvisionedNames = content => {
  const names = []
  const patterns = [
    /(?:secrets|vars)\.([A-Z][A-Z0-9_]*)/gu,
    /^\s*([A-Z][A-Z0-9_]*)\s*:\s*(?:\$\{\{|["'])/gmu,
    /(?:name|key|secret_id)\s*=\s*["']([A-Z][A-Z0-9_]*)["']/gu,
    /^\s*(?:ARG|ENV)\s+([A-Z][A-Z0-9_]*)/gmu,
  ]
  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) names.push(match[1])
  }
  return names
}

const pathSelected = (path, selectors = []) =>
  selectors.some(
    selector =>
      path === selector || path.startsWith(`${selector.replace(/\/$/u, "")}/`),
  )

export const inspectEnvironmentFromFileMap = ({ files, environment = {} }) => {
  const used = new Set()
  const declared = new Set()
  const provisioned = new Set()
  for (const file of files) {
    if (CREDENTIAL_PATH.test(file.path)) continue
    const runtimeSource =
      pathSelected(file.path, environment.sourceDirectories ?? []) &&
      !/(?:^|\/)(?:test|tests|__tests__|cypress)(?:\/|$)|\.(?:spec|test)\.[cm]?[jt]sx?$/u.test(
        file.path,
      ) &&
      (!file.path.startsWith("scripts/autonomy/") ||
        file.path === "scripts/autonomy/notify-pr-ci-slack.mjs")
    if (runtimeSource) {
      extractUsedNames(file.content).forEach(name => used.add(name))
    }
    if (pathSelected(file.path, environment.declarationFiles ?? [])) {
      extractDeclaredNames(file.path, file.content).forEach(name =>
        declared.add(name),
      )
    }
    if (pathSelected(file.path, environment.provisioningSources ?? [])) {
      extractProvisionedNames(file.content).forEach(name =>
        provisioned.add(name),
      )
    }
  }
  const missing = [...used].filter(
    name =>
      !declared.has(name) &&
      !provisioned.has(name) &&
      !allowlisted(name, environment.allowDynamic),
  )
  const documentedUnused = [...declared].filter(
    name =>
      !used.has(name) && !allowlisted(name, environment.allowDocumentedUnused),
  )
  const provisionedUnused = [...provisioned].filter(
    name =>
      !used.has(name) && !allowlisted(name, environment.allowProvisionedUnused),
  )
  const publicSecretExposure = [...used].filter(
    name =>
      name.startsWith("NEXT_PUBLIC_") &&
      SECRET_LIKE_NAME.test(name) &&
      !allowlisted(name, environment.allowPublic),
  )
  return {
    used: uniqueSorted(used),
    declared: uniqueSorted(declared),
    provisioned: uniqueSorted(provisioned),
    missing: uniqueSorted(missing),
    documentedUnused: uniqueSorted(documentedUnused),
    provisionedUnused: uniqueSorted(provisionedUnused),
    publicSecretExposure: uniqueSorted(publicSecretExposure),
  }
}

export const inspectRepositoryEnvironment = (root, contract) => {
  const files = []
  for (const path of listRepositoryFiles(root)) {
    if (
      !TEXT_EXTENSIONS.has(extname(path)) &&
      !path.endsWith("Dockerfile") &&
      !path.includes(".env.example")
    )
      continue
    if (
      CREDENTIAL_PATH.test(path) ||
      (/(?:^|\/)\.env(?:\.|$)/u.test(path) && !path.endsWith(".env.example"))
    )
      continue
    try {
      files.push({ path, content: readFileSync(resolve(root, path), "utf8") })
    } catch {
      // Files removed between git inventory and read are ignored; the diff still records them.
    }
  }
  return inspectEnvironmentFromFileMap({
    files,
    environment: contract.environment,
  })
}

export const inspectRepositoryEnvironmentAtRef = (root, contract, ref) => {
  const paths = runGit(root, ["ls-tree", "-r", "--name-only", ref])
    .split(/\r?\n/u)
    .filter(Boolean)
  const files = []
  for (const path of paths) {
    if (
      !TEXT_EXTENSIONS.has(extname(path)) &&
      !path.endsWith("Dockerfile") &&
      !path.includes(".env.example")
    )
      continue
    if (
      CREDENTIAL_PATH.test(path) ||
      (/(?:^|\/)\.env(?:\.|$)/u.test(path) && !path.endsWith(".env.example"))
    )
      continue
    const content = runGit(root, ["show", `${ref}:${path}`], true)
    if (content !== "") files.push({ path, content })
  }
  return inspectEnvironmentFromFileMap({
    files,
    environment: contract.environment,
  })
}

export const detectCredentialPaths = changedPaths =>
  uniqueSorted(changedPaths.filter(path => CREDENTIAL_PATH.test(path)))

const isRuntimeInfrastructureDependencyPath = path =>
  !path.startsWith("scripts/autonomy/") &&
  !/(?:^|\/)(?:__tests__|__test-utils__|tests?|cypress)(?:\/|$)/u.test(path) &&
  !/\.(?:test|spec|stories)\.[cm]?[jt]sx?$/u.test(path)

export const detectInfrastructureDependencyDriftFromFileMap = ({
  files,
  diffs,
  contract,
}) => {
  const declarationSelectors = [
    ...(contract.infrastructureDirectories ?? []),
    ...(contract.environment?.provisioningSources ?? []),
  ]
  const declarationText = files
    .filter(file => pathSelected(file.path, declarationSelectors))
    .map(file => file.content)
    .join("\n")
  const sourceSelectors = contract.environment?.sourceDirectories ?? []
  const findings = []

  for (const [path, diff] of diffs) {
    if (
      !pathSelected(path, sourceSelectors) ||
      !isRuntimeInfrastructureDependencyPath(path)
    )
      continue
    const added = diff
      .split(/\r?\n/u)
      .filter(line => line.startsWith("+") && !line.startsWith("+++"))
      .join("\n")
    for (const dependency of INFRASTRUCTURE_DEPENDENCIES) {
      if (
        !dependency.source.test(added) ||
        dependency.declaration.test(declarationText)
      )
        continue
      findings.push({
        code: "INFRASTRUCTURE_DEPENDENCY_UNDECLARED",
        severity: "error",
        dependency: dependency.name,
        path,
      })
    }
  }
  return findings
}

export const detectInfrastructureDependencyDrift = (root, contract, diffs) => {
  const files = []
  for (const path of listRepositoryFiles(root)) {
    if (!TEXT_EXTENSIONS.has(extname(path)) && !path.endsWith("Dockerfile"))
      continue
    if (CREDENTIAL_PATH.test(path) || /(?:^|\/)\.env(?:\.|$)/u.test(path))
      continue
    try {
      files.push({ path, content: readFileSync(resolve(root, path), "utf8") })
    } catch {
      // A concurrently removed declaration is still represented by the diff.
    }
  }
  return detectInfrastructureDependencyDriftFromFileMap({
    files,
    diffs,
    contract,
  })
}

export const affectedConsumersFor = (paths, contract) => {
  const relationship = contract.relationships ?? {}
  const contractPaths = relationship.contractPaths ?? []
  if (
    !paths.some(path =>
      contractPaths.some(pattern => matchesConfiguredPattern(path, pattern)),
    )
  )
    return []
  return uniqueSorted(relationship.consumers ?? [])
}

export const validateContract = contract => {
  const errors = []
  if (contract?.schemaVersion !== 1) errors.push("schemaVersion must equal 1")
  if (typeof contract?.repository?.name !== "string")
    errors.push("repository.name is required")
  if (typeof contract?.runtime?.node !== "string")
    errors.push("runtime.node is required")
  if (typeof contract?.runtime?.packageManager !== "string")
    errors.push("runtime.packageManager is required")
  for (const command of [
    "verifyChanged",
    "verify",
    "verifyProductionReadiness",
  ]) {
    if (typeof contract?.commands?.[command] !== "string")
      errors.push(`commands.${command} is required`)
  }
  if (contract?.staticAnalysis?.newFindings !== "ZERO_TOLERANCE")
    errors.push("staticAnalysis.newFindings must equal ZERO_TOLERANCE")
  if (contract?.staticAnalysis?.autofixPolicy !== "SAFE_AUTOFIX_THEN_BLOCK")
    errors.push(
      "staticAnalysis.autofixPolicy must equal SAFE_AUTOFIX_THEN_BLOCK",
    )
  if (!Array.isArray(contract?.staticAnalysis?.scanners))
    errors.push("staticAnalysis.scanners must be an array")
  for (const field of [
    "entryPoints",
    "deployables",
    "criticalPaths",
    "infrastructureDirectories",
    "secretReferenceSources",
    "terraformDirectories",
    "ciWorkflows",
    "previewTypes",
    "validationArtifacts",
  ]) {
    if (!Array.isArray(contract?.[field]))
      errors.push(`${field} must be an array`)
  }
  if (!Array.isArray(contract?.relationships?.providers))
    errors.push("relationships.providers must be an array")
  if (!Array.isArray(contract?.relationships?.consumers))
    errors.push("relationships.consumers must be an array")
  if (typeof contract?.browser?.relevant !== "boolean")
    errors.push("browser.relevant must be boolean")
  return errors
}

export const loadContract = root =>
  JSON.parse(
    readFileSync(resolve(root, ".prokodo/engineering-contract.json"), "utf8"),
  )

export const buildDiffMap = (root, base, paths) =>
  new Map(paths.map(path => [path, safeDiffFor(root, base, path)]))

export const findingsFromEnvironment = (inventory, baseline = null) => {
  const newNames = (field, values) => {
    if (baseline === null) return values
    const previous = new Set(baseline[field] ?? [])
    return values.filter(value => !previous.has(value))
  }
  return [
    ...newNames("missing", inventory.missing).map(name => ({
      code: "ENV_USED_UNDECLARED",
      severity: "error",
      name,
    })),
    ...newNames("documentedUnused", inventory.documentedUnused).map(name => ({
      code: "ENV_DOCUMENTED_UNUSED",
      severity: "advisory",
      name,
    })),
    ...newNames("provisionedUnused", inventory.provisionedUnused).map(name => ({
      code: "ENV_PROVISIONED_UNUSED",
      severity: "advisory",
      name,
    })),
    ...newNames("publicSecretExposure", inventory.publicSecretExposure).map(
      name => ({ code: "PUBLIC_SECRET_EXPOSURE", severity: "error", name }),
    ),
  ]
}

export const determineReadinessState = ({ risk, findings }) => {
  if (
    risk === "CRITICAL" ||
    findings.some(
      finding =>
        finding.severity === "critical" || finding.severity === "error",
    )
  ) {
    return "BLOCKED"
  }
  if (risk === "HIGH") return "HUMAN_APPROVAL_REQUIRED"
  if (findings.some(finding => finding.severity === "advisory"))
    return "PASS_WITH_ADVISORIES"
  return "PASS"
}

export const analyzeRepository = (root, requestedBase) => {
  const contract = loadContract(root)
  const contractErrors = validateContract(contract)
  const base = resolveBase(root, requestedBase)
  const changedFiles = listChangedFiles(root, base)
  const changeClasses = classifyChanges(changedFiles)
  const diffs = buildDiffMap(root, base, changedFiles)
  const { risk, signals } = determineRisk({
    paths: changedFiles,
    classes: changeClasses,
    contract,
    diffs,
  })
  const affectedConsumers = affectedConsumersFor(changedFiles, contract)
  const infrastructureDependencyFindings = detectInfrastructureDependencyDrift(
    root,
    contract,
    diffs,
  )
  return {
    contract,
    contractErrors,
    base,
    changedFiles,
    changeClasses,
    risk,
    riskSignals: signals,
    affectedConsumers,
    infrastructureDependencyFindings,
  }
}

export const classifyCommandFailure = ({ command, output = "" }) => {
  if (
    /listen EPERM|operation not permitted|\bEACCES\b|\bENOSPC\b/iu.test(output)
  )
    return "ENVIRONMENT"
  if (/watchman|Cypress.*(?:binary|verify)/iu.test(output)) return "HARNESS"
  if (
    /ENOTFOUND|ETIMEDOUT|ECONNRESET|rate.?limit|service unavailable/iu.test(
      output,
    )
  )
    return "EXTERNAL_SERVICE"
  if (/terraform|firebase|vercel|docker/iu.test(command)) return "ENVIRONMENT"
  if (/test|jest|vitest|cypress/iu.test(command)) return "REGRESSION"
  return "REGRESSION"
}

export const exitCodeFor = result =>
  RESULT_EXIT_CODES[result] ?? RESULT_EXIT_CODES.BLOCKED
