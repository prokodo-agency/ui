# Validation contract

- `pnpm verify:changed --base <sha>` routes changed components/contracts to type, unit and consumer checks.
- `pnpm verify` runs contract tests, formatting, lint, source/Cypress typechecks, 100%-threshold unit coverage, Cypress component tests, build and consumer-contract validation.
- `pnpm verify:production-readiness --base <sha>` classifies package/release/CI risk and ENV reference drift.

The manual version-bump workflow and both release jobs use pnpm 9.15.9, matching
the exact `packageManager` version in `package.json`. A major-only `version: 9`
conflicts with that declaration in `pnpm/action-setup` and fails before the bump,
tests or publication can run. Keep explicit setup versions synchronized when
updating the package-manager pin, or let the action read `packageManager` directly.
The selected patch/minor/major increment, publication checks and release approval
remain unchanged. After the workflow fix is merged, an administrator can start a
new bump run from current Main; rerunning a historical run uses its old workflow.
Consumers retain their current dependency and compatibility patch until the
release checks pass and the new version is actually available on npm.

Install/verify Cypress in the repository-local `.cache/Cypress` using `pnpm cypress:install` and `pnpm cypress:verify`; no ambient home cache is trusted. Jest has `watchman: false` for sandbox/CI reproducibility.

The release job caches that same repository-local path and always runs both
commands before tests, including on a cache hit. A restored cache is an
optimization, not proof that the locked binary exists and runs. The earlier
release installed into the home cache while `test:e2e:ci` used the repository
cache; all unit tests passed but browser tests could not start.

After merging a release-workflow repair, an administrator may resume the **Release**
workflow on **main** with the exact existing `package.json` version (for example
`1.0.14`). No additional version bump is required. The workflow rejects other
branches/tags, mismatched or missing versions and unrelated event types, then
runs the full tests/build/publication chain. Ordinary main pushes remain ignored;
existing `chore(release):` bump pushes keep their behavior. Publication, GitHub
release and docs deployment still require the successful publish job. This
recovery entry does not authorize an agent to merge or publish without the
protected administrator decision. Release runs are serialized. Manual recovery
requires an unpublished version; if npm already succeeded, resume the failed
post-publication jobs from their original run instead. Consumer updates still
wait for npm availability.

Exit codes and failure classes match the other SaaS repositories. Never remove assertions, reduce 100% thresholds, skip component/axe checks or use retries to hide failure.

CI runs production readiness through `pnpm verify:production-readiness:ci`. Exit codes `10` and `20` keep the verification pipeline green while their advisories or HIGH-risk admin decision remain visible in the artifact and sticky PR comment. Exit code `30`, an invalid/missing artifact, and every unit, component, accessibility, visual, build, consumer-contract or scanner failure remain blocking. A merge, release or publication of the public package is never automated for `HUMAN_APPROVAL_REQUIRED`.

A trusted workflow-run aggregator posts Slack Block Kit summaries to the CI/CD channel without executing public-package PR code with Slack credentials. It carries the same value-free readiness result, risk signals, affected consumers, environment counts and findings as the sticky GitHub quality-gate comment. A failed monitored workflow is reported immediately; admin-review readiness is announced only after every monitored workflow for the current commit completes. Failed messages list the failed jobs/checks and link directly to their logs. Superseded commits are ignored, and Slack delivery is non-blocking when the bot token or channel is unavailable.

Automatic repair is limited to three attempts for the same failure class. After that, stop with `BLOCKED` or `HUMAN_APPROVAL_REQUIRED`.

Static analysis uses `ZERO_TOLERANCE` with `SAFE_AUTOFIX_THEN_BLOCK`. An autonomy run applies only safe scanner-supported fixes, reviews the resulting diff and reruns the scanner. Any remaining CodeQL, ESLint, axe or equivalent finding must be repaired in the PR; warnings are blocking and may not be hidden with a new suppression.
