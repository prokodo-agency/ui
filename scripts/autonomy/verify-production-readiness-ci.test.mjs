import assert from "node:assert/strict"
import { test } from "node:test"

import { ciExitCodeFor } from "./verify-production-readiness-ci.mjs"

test("keeps pass, advisory and admin-decision readiness results green in CI", () => {
  assert.equal(ciExitCodeFor(0), 0)
  assert.equal(ciExitCodeFor(10), 0)
  assert.equal(ciExitCodeFor(20), 0)
})

test("preserves blocked and unexpected readiness failures", () => {
  assert.equal(ciExitCodeFor(30), 30)
  assert.equal(ciExitCodeFor(1), 1)
  assert.equal(ciExitCodeFor(null), 30)
})
