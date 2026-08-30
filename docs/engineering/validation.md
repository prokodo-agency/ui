# Validation contract

- `pnpm verify:changed --base <sha>` routes changed components/contracts to type, unit and consumer checks.
- `pnpm verify` runs contract tests, formatting, lint, source/Cypress typechecks, 100%-threshold unit coverage, Cypress component tests, build and consumer-contract validation.
- `pnpm verify:production-readiness --base <sha>` classifies package/release/CI risk and ENV reference drift.

Install/verify Cypress in the repository-local `.cache/Cypress` using `pnpm cypress:install` and `pnpm cypress:verify`; no ambient home cache is trusted. Jest has `watchman: false` for sandbox/CI reproducibility.

Exit codes and failure classes match the other SaaS repositories. Never remove assertions, reduce 100% thresholds, skip component/axe checks or use retries to hide failure.

Automatic repair is limited to three attempts for the same failure class. After that, stop with `BLOCKED` or `HUMAN_APPROVAL_REQUIRED`.
