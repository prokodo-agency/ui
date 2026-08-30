# Validation contract

- `pnpm verify:changed --base <sha>` routes changed components/contracts to type, unit and consumer checks.
- `pnpm verify` runs contract tests, formatting, lint, source/Cypress typechecks, 100%-threshold unit coverage, Cypress component tests, build and consumer-contract validation.
- `pnpm verify:production-readiness --base <sha>` classifies package/release/CI risk and ENV reference drift.

Install/verify Cypress in the repository-local `.cache/Cypress` using `pnpm cypress:install` and `pnpm cypress:verify`; no ambient home cache is trusted. Jest has `watchman: false` for sandbox/CI reproducibility.

Exit codes and failure classes match the other SaaS repositories. Never remove assertions, reduce 100% thresholds, skip component/axe checks or use retries to hide failure.

CI runs production readiness through `pnpm verify:production-readiness:ci`. Exit codes `10` and `20` keep the verification pipeline green while their advisories or HIGH-risk admin decision remain visible in the artifact and sticky PR comment. Exit code `30`, an invalid/missing artifact, and every unit, component, accessibility, visual, build, consumer-contract or scanner failure remain blocking. A merge, release or publication of the public package is never automated for `HUMAN_APPROVAL_REQUIRED`.

A trusted workflow-run aggregator posts Slack Block Kit summaries to the CI/CD channel without executing public-package PR code with Slack credentials. It carries the same value-free readiness result, risk signals, affected consumers, environment counts and findings as the sticky GitHub quality-gate comment. A failed monitored workflow is reported immediately; admin-review readiness is announced only after every monitored workflow for the current commit completes. Failed messages list the failed jobs/checks and link directly to their logs. Superseded commits are ignored, and Slack delivery is non-blocking when the bot token or channel is unavailable.

Automatic repair is limited to three attempts for the same failure class. After that, stop with `BLOCKED` or `HUMAN_APPROVAL_REQUIRED`.

Static analysis uses `ZERO_TOLERANCE` with `SAFE_AUTOFIX_THEN_BLOCK`. An autonomy run applies only safe scanner-supported fixes, reviews the resulting diff and reruns the scanner. Any remaining CodeQL, ESLint, axe or equivalent finding must be repaired in the PR; warnings are blocking and may not be hidden with a new suppression.
