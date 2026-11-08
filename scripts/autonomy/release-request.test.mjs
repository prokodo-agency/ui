import assert from "node:assert/strict"
import { execFileSync, spawnSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import { fileURLToPath } from "node:url"

import { verifyReleaseRequest } from "./verify-release-request.mjs"

const request = {
  event: "workflow_dispatch",
  ref: "refs/heads/main",
  expectedVersion: "1.0.14",
  commitMessage: "fix(ci): repair release tooling",
  packageName: "@prokodo/ui",
  packageVersion: "1.0.14",
}

test("manual recovery verifies the current version without requiring a second bump", () => {
  assert.deepEqual(verifyReleaseRequest(request), { version: "1.0.14" })
})

test("the existing main bump push remains authorized without manual input", () => {
  assert.deepEqual(
    verifyReleaseRequest({
      ...request,
      event: "push",
      expectedVersion: "",
      commitMessage: "chore(release): v1.0.14",
    }),
    { version: "1.0.14" },
  )
})

test("ordinary main pushes and untrusted events cannot publish", () => {
  assert.throws(
    () => verifyReleaseRequest({ ...request, event: "push" }),
    /release_bump_commit_required/,
  )
  for (const event of ["pull_request", "workflow_run", "", undefined])
    assert.throws(
      () => verifyReleaseRequest({ ...request, event }),
      /release_event_invalid/,
    )
})

test("manual and bump requests cannot release branches or tags", () => {
  for (const event of ["workflow_dispatch", "push"])
    for (const ref of [
      "refs/heads/fix",
      "refs/tags/v1.0.14",
      "main",
      undefined,
    ])
      assert.throws(
        () => verifyReleaseRequest({ ...request, event, ref }),
        /release_main_required/,
      )
})

test("missing, stale and injected manual version inputs fail closed", () => {
  for (const expectedVersion of [
    undefined,
    "",
    "1.0.13",
    "1.0.15",
    "v1.0.14",
    "1.0.14\n",
    "1.0.14; echo unsafe",
  ])
    assert.throws(
      () => verifyReleaseRequest({ ...request, expectedVersion }),
      /release_exact_version_required/,
    )
})

test("foreign packages and unsupported versions cannot publish", () => {
  assert.throws(
    () => verifyReleaseRequest({ ...request, packageName: "other" }),
    /release_package_invalid/,
  )
  for (const packageVersion of [
    undefined,
    14,
    "",
    "latest",
    "01.0.14",
    "1.0.14-rc.1",
    "1.0.14\n",
  ])
    assert.throws(
      () => verifyReleaseRequest({ ...request, packageVersion }),
      /release_package_invalid/,
    )
})

test("the workflow CLI validates the real package and rejects a stale requested version", () => {
  const script = fileURLToPath(
    new URL("./verify-release-request.mjs", import.meta.url),
  )
  const pkg = JSON.parse(
    readFileSync(new URL("../../package.json", import.meta.url), "utf8"),
  )
  const args = [script, "workflow_dispatch", "refs/heads/main", pkg.version, ""]
  assert.deepEqual(
    JSON.parse(execFileSync(process.execPath, args, { encoding: "utf8" })),
    { version: pkg.version },
  )
  const invalid = spawnSync(
    process.execPath,
    [
      script,
      "workflow_dispatch",
      "refs/heads/main",
      `${pkg.version}-stale`,
      "",
    ],
    { encoding: "utf8" },
  )
  assert.equal(invalid.status, 1)
  assert.match(invalid.stderr, /release_exact_version_required/)
})

test("manual recovery refuses an already published version without changing push idempotency", () => {
  const workflow = readFileSync(
    new URL("../../.github/workflows/release.yml", import.meta.url),
    "utf8",
  )
  const step = workflow
    .split("      - name: 🔍 Check whether version already exists on npm")[1]
    .split("      - name: 🚀 Publish")[0]
  const script = step
    .split("        run: |\n")[1]
    .replace(/^          /gm, "")
    .replace("${{ steps.ver.outputs.version }}", "1.0.14")
  for (const [event, exists, expectedExit] of [
    ["workflow_dispatch", true, 1],
    ["workflow_dispatch", false, 0],
    ["push", true, 0],
  ]) {
    const result = spawnSync(
      "bash",
      ["-e", "-c", `npm() { return ${exists ? 0 : 1}; }\n${script}`],
      {
        cwd: fileURLToPath(new URL("../../", import.meta.url)),
        env: {
          ...process.env,
          CI_RELEASE_EVENT: event,
          GITHUB_OUTPUT: "/dev/null",
        },
        encoding: "utf8",
      },
    )
    assert.equal(result.status, expectedExit, result.stderr)
  }
})

test("release uses the test runner's repository cache and verifies restored binaries", () => {
  const workflow = readFileSync(
    new URL("../../.github/workflows/release.yml", import.meta.url),
    "utf8",
  )
  const pkg = JSON.parse(
    readFileSync(new URL("../../package.json", import.meta.url), "utf8"),
  )
  for (const name of ["cypress:install", "cypress:verify", "test:e2e:ci"])
    assert.match(pkg.scripts[name], /CYPRESS_CACHE_FOLDER=\.cache\/Cypress/)
  assert.match(workflow, /path: \.cache\/Cypress/)
  assert.doesNotMatch(workflow, /~\/\.cache\/Cypress|cache-hit !=/)
  assert.match(workflow, /run: pnpm cypress:install/)
  assert.match(workflow, /run: pnpm cypress:verify/)
  assert.ok(
    workflow.indexOf("run: pnpm cypress:verify") <
      workflow.indexOf("run: pnpm run test:ci"),
  )
  assert.ok(
    workflow.indexOf("node scripts/autonomy/verify-release-request.mjs") <
      workflow.indexOf("npm publish --access public"),
  )
})
