# Agent guide

## Scope

This repository owns the published `@prokodo/ui` React library, its exports, Storybook/docs, unit/component/accessibility tests and release metadata. Portal and Website are independent consumers.

## Setup

Use Node 22+ and pnpm 9.15.9. Run `pnpm install --frozen-lockfile`, then `pnpm cypress:install` once for the repository-local Cypress cache.

## Canonical commands

- `pnpm verify:changed --base <sha>`
- `pnpm verify`
- `pnpm verify:production-readiness --base <sha>`
- `pnpm verify:production-readiness:ci --base <sha>` (keeps review-only results green; `BLOCKED` remains red)
- `pnpm verify:consumers --base <sha>`

Configured static-analysis findings have zero tolerance. Apply only scanner-provided or otherwise clearly safe autofixes, review the diff, and rerun the scanner. Fix every remaining CodeQL, ESLint, axe, or equivalent finding in the same branch; never leave it as a PR warning or suppress it to obtain a pass.

## Risk and approval

Breaking exports/peer dependencies and release/workflow changes are HIGH. Removed exports, missing Changesets for public changes, secrets, publishing credentials, or weakened Jest/Cypress/axe/Chromatic gates block autonomy. Do not silently align consumer versions.

HIGH risk requires an administrator decision for the protected merge, release or publication of this public library, but does not fail CI after every automated check passes. `BLOCKED` and validation failures always fail CI; the public package must never be auto-published from a review-only result.

A trusted workflow-run aggregator sends value-free Slack quality-gate summaries. It reports a failed workflow immediately and announces admin-review readiness only after every monitored workflow for the current commit completes. Never include environment names/values, secrets, raw logs or customer data; include only classifications, counts, failed step/check names and GitHub links.

## Further reading

- [System context](docs/architecture/system-context.md)
- [Validation](docs/engineering/validation.md)
- [Change risk](docs/security/change-risk.md)
- [Environment contract](docs/infrastructure/environment-contract.md)
- [Critical UX flows](docs/ux/critical-flows.md)
- Existing component API and visual docs: `README.md`, Storybook and `docs/`
