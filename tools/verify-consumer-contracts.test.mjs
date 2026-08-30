import assert from "node:assert/strict"
import { test } from "node:test"

import { compareConsumerContracts } from "./verify-consumer-contracts.mjs"

const pkg = {
  version: "1.0.13",
  exports: { ".": { import: "./dist/index.js" } },
  peerDependencies: { react: ">=18", "react-dom": ">=18" },
}

test("keeps harness-only changes consumer-neutral", () => {
  assert.deepEqual(
    compareConsumerContracts({
      current: pkg,
      baseline: pkg,
      changedFiles: ["scripts/autonomy/core.mjs"],
    }),
    {
      result: "PASS",
      changeType: "none",
      version: "1.0.13",
      addedExports: [],
      removedExports: [],
      peerDependenciesChanged: false,
      changesetPresent: false,
      affectedConsumers: [],
      findings: [],
    },
  )
})

test("keeps source tests and stories consumer-neutral", () => {
  const result = compareConsumerContracts({
    current: pkg,
    baseline: pkg,
    changedFiles: [
      "src/components/input/Input.test.tsx",
      "src/components/button/Button.stories.tsx",
      "src/tests/index.tsx",
    ],
  })
  assert.equal(result.result, "PASS")
  assert.equal(result.changeType, "none")
  assert.deepEqual(result.affectedConsumers, [])
})

test("requires a changeset for an additive public export", () => {
  const current = {
    ...pkg,
    exports: { ...pkg.exports, "./button": "./dist/button.js" },
  }
  const result = compareConsumerContracts({
    current,
    baseline: pkg,
    changedFiles: ["package.json"],
  })
  assert.equal(result.result, "BLOCKED")
  assert.deepEqual(result.affectedConsumers, [
    "prokodo-portal",
    "prokodo-website",
  ])
})

test("marks removed exports as breaking and consumer-relevant", () => {
  const current = { ...pkg, exports: {} }
  const result = compareConsumerContracts({
    current,
    baseline: pkg,
    changedFiles: ["package.json", ".changeset/remove.md"],
  })
  assert.equal(result.result, "HUMAN_APPROVAL_REQUIRED")
  assert.equal(result.changeType, "breaking")
})
