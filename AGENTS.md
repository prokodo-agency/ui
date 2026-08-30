# Agent guide

## Scope

This repository owns the published `@prokodo/ui` React library, its exports, Storybook/docs, unit/component/accessibility tests and release metadata. Portal and Website are independent consumers.

## Setup

Use Node 22+ and pnpm 9.15.9. Run `pnpm install --frozen-lockfile`, then `pnpm cypress:install` once for the repository-local Cypress cache.

## Canonical commands

- `pnpm verify:changed --base <sha>`
- `pnpm verify`
- `pnpm verify:production-readiness --base <sha>`
- `pnpm verify:consumers --base <sha>`

## Risk and approval

Breaking exports/peer dependencies and release/workflow changes are HIGH. Removed exports, missing Changesets for public changes, secrets, publishing credentials, or weakened Jest/Cypress/axe/Chromatic gates block autonomy. Do not silently align consumer versions.

## Further reading

- [System context](docs/architecture/system-context.md)
- [Validation](docs/engineering/validation.md)
- [Change risk](docs/security/change-risk.md)
- [Environment contract](docs/infrastructure/environment-contract.md)
- [Critical UX flows](docs/ux/critical-flows.md)
- Existing component API and visual docs: `README.md`, Storybook and `docs/`
