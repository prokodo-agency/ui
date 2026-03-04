# Contributing to prokodo-ui

Thank you for taking the time to contribute! Before submitting code or documentation,
please read this guide carefully.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Developer Certificate of Origin (DCO)](#developer-certificate-of-origin-dco)
3. [Reporting Issues](#reporting-issues)
4. [Getting Started Locally](#getting-started-locally)
5. [Opening a Pull Request](#opening-a-pull-request)
6. [Coding Conventions](#coding-conventions)
7. [Commit Message Style](#commit-message-style)

---

## Code of Conduct

This project is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating
you agree to abide by its terms.

---

## Developer Certificate of Origin (DCO)

This project uses the **Developer Certificate of Origin 1.1** to ensure that
contributors have the right to submit their code.

Every commit must include a `Signed-off-by` trailer:

```
Signed-off-by: Your Name <your.email@example.com>
```

The easiest way to add this is with `git commit --signoff` (or `-s`).  
By signing off you certify the following (see <https://developercertificate.org>):

```
Developer Certificate of Origin
Version 1.1

Copyright (C) 2004, 2006 The Linux Foundation and its contributors.

Everyone is permitted to copy and distribute verbatim copies of this
license document, but changing it is not allowed.


Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I
    have the right to submit it under the open source license
    indicated in the file; or

(b) The contribution is based upon previous work that, to the best
    of my knowledge, is covered under an appropriate open source
    license and I have the right under that license to submit that
    work with modifications, whether created in whole or in part
    by me, under the same open source license (unless I am
    permitted to submit under a different license), as indicated
    in the file; or

(c) The contribution was provided directly to me by some other
    person who certified (a), (b) or (c) and I have not modified
    it.

(d) I understand and agree that this project and the contribution
    are public and that a record of the contribution (including all
    personal information I submit with it, including my sign-off) is
    maintained indefinitely and may be redistributed consistent with
    this project or the open source license(s) involved.
```

**DCO check:** A CI job verifies that all commits in a PR carry the
`Signed-off-by` trailer. PRs that fail this check will not be merged.

---

## Reporting Issues

- Search [existing issues](https://github.com/prokodo-agency/ui/issues) before opening a new one.
- For security vulnerabilities, follow the process in [SECURITY.md](SECURITY.md) instead.
- Use the appropriate issue template (bug report / feature request).

---

## Getting Started Locally

```bash
# Prerequisites: Node 20+, pnpm 9+
git clone https://github.com/prokodo-agency/ui.git
cd ui
pnpm install

# Run Storybook
pnpm storybook

# Run tests
pnpm test:unit

# Build
pnpm build
```

---

## Opening a Pull Request

1. Fork the repository and create a feature branch from `main`.
2. Follow the [Coding Conventions](#coding-conventions) below.
3. Ensure all existing tests pass (`pnpm test`).
4. Add or update tests for any changed behaviour.
5. Sign off every commit (`git commit -s`).
6. Open a PR against `main` with a clear description of what changed and why.
7. Link any relevant issues using `Closes #<issue>`.

**Small, focused PRs are much easier to review.** Split unrelated changes into
separate PRs where possible.

---

## Coding Conventions

- **TypeScript** — all new code must be typed; avoid `any` in production code.
- **SCSS Modules** — component styles live alongside the component in `.module.scss`
  files. Use `var(--pk-*)` design tokens; do not hardcode colour literals in
  component stylesheets.
- **No runtime theming additions** — theming is handled entirely via CSS custom
  properties. Do not add JavaScript-powered theming logic.
- **BEM-style naming** — follow the existing class naming conventions.
- **Accessibility** — new interactive components must meet WCAG 2.1 AA.
- Run `pnpm lint` and `pnpm typecheck` before pushing.

---

## Commit Message Style

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <short description>

[optional body]

Signed-off-by: Your Name <your@email.com>
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`.

---

For large feature proposals, open a discussion or issue first to align on the
approach before investing significant implementation effort.
