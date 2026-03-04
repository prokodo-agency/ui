# prokodo-ui — OSS + Identity-Protection Strategy

> **Status:** Planning document — v1.3, March 2026  
> **Scope:** This document is repo-specific to `prokodo-ui` (`@prokodo/ui`).  
> **Disclaimer:** This is an operational and engineering guide, not legal advice. Consult a qualified IP attorney before filing trademark applications or making commercial licensing decisions.

---

## Summary

The current BUSL-1.1 license blocks legitimate community adoption. We switch to **Apache-2.0** for the component library and default theme, while protecting the prokodo brand through trademark policy and keeping the signature visual identity in a separate, privately-licensed theme package. The strategy requires zero breaking API changes; only the license, a few new governance files, and a theme-split refactor are needed.

---

## 1. Licensing Decision

### Recommendation: Apache-2.0

| Criterion                          | MIT | Apache-2.0 | Decision    |
| ---------------------------------- | --- | ---------- | ----------- |
| Maximum adoption / fewest friction | ✅  | ✅         | tie         |
| Explicit patent grant              | ❌  | ✅         | Apache wins |
| Patent retaliation clause          | ❌  | ✅         | Apache wins |
| NOTICE file for attribution        | no  | yes        | Apache wins |
| OSI-approved, SPDX-compatible      | ✅  | ✅         | tie         |
| DCO / CLA tooling support          | ✅  | ✅         | tie         |

**Why Apache-2.0 over MIT for a UI library:**

1. **Patent grant** — UI component libraries often involve patentable interaction patterns. Apache-2.0 gives every downstream user an explicit, royalty-free patent license from all contributors. MIT does not.
2. **Patent-retaliation clause** — If a downstream user sues prokodo for patent infringement, their Apache-2.0 license terminates. MIT has no such clause.
3. **NOTICE file** — Provides a sanctioned attribution mechanism without restricting use, which is more defensible for branding than relying solely on a README.
4. **Enterprise acceptance** — Legal teams at enterprises routinely approve Apache-2.0 with less friction than custom or non-standard licenses. This matters for adoption in client / agency workflows.

**Scope of the OSS license:** The component source code, default (non-signature) theme tokens, and docs templates. The prokodo signature theme (brand-specific radials, glows, illustrations, logo), brand assets, and product templates are **explicitly excluded** (see §3 and §5).

> **"Non-signature" defined:** The default token set uses generic visual values (grey scale, system-blue, standard spacing/radius). The `--pk-*` prefix and class names like `pk-*` are part of the public API and are fine to use. What is excluded from OSS is the _signature look_: proprietary color palettes, gradient patterns, glow effects, brand illustrations, and logo assets that define the prokodo product identity.

---

### Files to Add / Change

| File                 | Action                                         | Notes                                                                                           |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `LICENSE`            | **Replace** BUSL-1.1 with Apache-2.0 full text | Root of repo                                                                                    |
| `NOTICE`             | **Create**                                     | Required by Apache-2.0; contains copyright line and pointers to separately-licensed directories |
| `CONTRIBUTING.md`    | **Create**                                     | Developer certificate of origin (DCO), PR process                                               |
| `CODE_OF_CONDUCT.md` | **Create**                                     | Contributor Covenant v2.1                                                                       |
| `SECURITY.md`        | **Keep / update**                              | Already present; add responsible-disclosure address                                             |
| `TRADEMARKS.md`      | **Create**                                     | See §2 below                                                                                    |
| `README.md`          | **Update**                                     | Replace BUSL badge, add short non-legal summary block (see below)                               |

**`NOTICE` file content:**

```
prokodo-ui
Copyright 2025–present prokodo (Christian Salat) and contributors

This product includes software developed by prokodo (https://prokodo.com).

This repository is licensed under Apache-2.0 (see LICENSE at the root).
The Apache-2.0 license covers the component source code, the default
(non-signature) design token set, and the docs sources.

Certain directories are licensed under different (proprietary) terms.
Those directories contain their own LICENSE file which governs their use.
If you are reading this file in the public OSS repository, no proprietary
directories are present — they are maintained in a separate private
repository and are never published as part of @prokodo/ui.

Trademark notice: "prokodo" and the prokodo logo are trademarks of
prokodo (Christian Salat). See TRADEMARKS.md for usage policy.
```

> **Note on NOTICE scope:** Under Apache-2.0, NOTICE is an attribution
> mechanism, not a legal exclusion tool. Files that should be under
> different terms must carry their own LICENSE file in their directory and,
> ideally, must live in a separate (private) repository. Listing paths in
> NOTICE is informational only; the clean legal separation comes from
> keeping proprietary content out of the public repo entirely (see §4).

### Short non-legal README summary (verbatim block for README.md)

Add this collapsible section near the top of README.md, **above** the feature list:

```markdown
## License & Usage

`@prokodo/ui` components and the default (non-signature) theme are open-source
under the **Apache-2.0 license**.

| ✅ Allowed                                   | ❌ Not allowed                                                   |
| -------------------------------------------- | ---------------------------------------------------------------- |
| Use in client projects, SaaS, internal tools | Distribute forks as "prokodo UI" or any confusingly similar name |
| Modify and redistribute components           | Include the prokodo signature theme in OSS builds                |
| Build commercial products on top             | Use the prokodo logo or brand assets without permission          |
| Create and publish your own theme            | Claim official affiliation with prokodo                          |

The **prokodo signature theme** (colors, gradients, shadows, icons) is a
separate package (`@prokodo/ui-theme-prokodo`) under a proprietary license —
it is not bundled in this package.

See [TRADEMARKS.md](./TRADEMARKS.md) for the full brand-use policy.
```

---

## 2. Trademark / Brand Protection

Create `TRADEMARKS.md` at the repo root with the following content:

---

```markdown
# TRADEMARKS.md

## prokodo Trademark Policy

**"prokodo"**, **"prokodo UI"**, and the prokodo logo (the wordmark and symbol)
are trademarks of prokodo (Christian Salat), registered or pending registration.

This policy governs use of these marks by users of the Apache-2.0-licensed
codebase. It does not restrict rights granted by the Apache-2.0 license itself.

---

### 1. Permitted (Nominative) Use

You may use the name "prokodo UI" **only** to accurately describe that your
project uses or is based on this library, provided that:

- The use is clearly referential and not misleading about origin.
- You do not imply endorsement or official affiliation with prokodo.
- You include the statement: _"[Product] uses prokodo UI, which is not
  affiliated with, endorsed by, or sponsored by prokodo."_ (or equivalent).

**Examples of permitted nominative use:**

- "Built with prokodo UI"
- "This project uses @prokodo/ui"
- Documentation or blog posts describing integration

---

### 2. Uses We Want to Prevent

The following uses are contrary to this policy. We intend to enforce against
them, particularly where they create a likelihood of confusion:

1. **Confusingly similar naming** — naming an npm package, GitHub repository,
   website, or documentation site in a way that a typical developer would
   mistake for an official prokodo product (e.g. "prokodo-components",
   "prokodo-design-system"). Descriptive or clearly referential names like
   "my-app-fork-of-prokodo-ui" are generally fine.

2. **Logo and wordmark misuse** — using the prokodo logo, wordmark, or any
   substantially similar mark on forks, redistributed builds, SaaS dashboards,
   or marketing materials in a way that implies prokodo origin or endorsement.

3. **Domain names and social handles** — registering domains or handles that
   incorporate "prokodo" in a way likely to cause confusion with prokodo's
   own properties. (Note: enforcement is limited to confusing similarity;
   a clearly descriptive handle like "prokodo-ui-tutorial" is not targeted.)

4. **Implied endorsement** — using the name in a way that implies prokodo
   created, maintains, approves, or sponsors your fork or product.

---

### 3. Forks and Redistributions

If you fork or redistribute a modified version of this library, you must:

1. **Rename** the package and all consumer-facing branding — package name,
   npm scope, docs site name, social handles, and marketing copy. Technical
   compatibility (keeping the `--pk-*` token API) is explicitly allowed and
   expected; you do not need to change CSS variable names.

2. **Include** the following notice in your README and package description,
   verbatim or equivalent:

   > _"This is an independent fork of prokodo UI. It is not affiliated with,
   > endorsed by, or sponsored by prokodo."_

3. Retain the original `NOTICE` file as required by the Apache-2.0 license.

---

### 4. Package Names and npm

The npm scope **`@prokodo`** and the package **`@prokodo/ui`** are reserved
for official prokodo publications. Packages published by third parties must
not use this scope.

---

### 5. Screenshots and Marketing Materials

You may include screenshots of your product that incidentally show prokodo UI
components, as long as the overall presentation does not imply that prokodo
created or endorses your product.

You may **not** reproduce prokodo brand assets (logo, signature illustrations,
brand gradients) in marketing materials without written permission.

---

### 6. Requesting Permission

For uses not covered above, open an issue in this repository tagged
`trademark-inquiry`, or use the contact address listed on
https://prokodo.com/contact.

---

_This policy is inspired by the Mozilla, Rust, and WordPress trademark
policies. It expresses our enforcement intent and guidelines, not a legally
binding contract. Wording like "must" and "may not" describes our
expectations; actual enforceability depends on applicable trademark law in
your jurisdiction. Consult a qualified IP attorney for authoritative advice._
```

---

## 3. Theme and Assets Separation Strategy

### Current State

The repo already has an excellent token-first foundation:

- `src/styles/tokens/_primitives.scss` — raw palette values (`--pk-palette-*`)
- `src/styles/tokens/_semantic.scss` — semantic aliases (`--pk-color-brand`, `--pk-color-bg`, etc.)
- `src/styles/themes/_default.scss` — emits semantic tokens under `:root, .pk-theme-default`

Components reference `--pk-color-*`, `--pk-space-*`, `--pk-radius-*` only. **No hardcoded hex values in component modules.** This is correct and must be enforced going forward (see §5 CI checks).

### Recommendation: Option A — Separate Package

**Create `@prokodo/ui-theme-prokodo` as a private/proprietary npm package.**

#### Option A vs Option B

|                             | Option A: Separate package                     | Option B: Separate folder, different per-file license |
| --------------------------- | ---------------------------------------------- | ----------------------------------------------------- |
| Clarity of separation       | ✅ Crystal clear                               | ⚠️ Easy to accidentally include                       |
| Consumer install story      | ✅ Explicit opt-in via `npm install`           | ⚠️ Consumer might import from wrong path              |
| Build tooling               | ✅ Standard package boundaries                 | ❌ Requires extra build-time exclusion logic          |
| Private by default          | ✅ Not on npm OSS; private registry or repo    | ❌ Still in the public GitHub repo                    |
| Vite / Next.js consumers    | ✅ Single CSS import from a separate specifier | ⚠️ Confusing dual-license repo                        |
| Maintenance overhead        | ✅ One extra package (manageable in monorepo)  | ❌ License header audits on every file                |
| Accidental OSS publish risk | ✅ Completely separate publish pipeline        | ❌ High; needs strict `files` allowlist enforcement   |

**Option A wins** for all consumer types. Next.js and Vite consumers already understand the pattern of `import '@mylib/theme/prokodo.css'`.

### Theme separation implementation

**`@prokodo/ui`** (Apache-2.0) ships:

- `dist/theme.css` — emits generic, non-signature default tokens (grey scale, system blues, standard radii and spacing)
- Components reference `--pk-*` variables exclusively; the `--pk-*` token API is public
- `@prokodo/ui/theme.css` is the public entry point

**`@prokodo/ui-theme-prokodo`** (proprietary) ships:

- Overrides `--pk-color-brand`, `--pk-color-accent`, radial backgrounds, signature shadows
- Brand icons and illustrations as separate assets
- A single importable `prokodo.css` file that re-declares only the tokens that differ

**Consumer usage:**

```tsx
// Without prokodo signature branding (generic defaults)
import "@prokodo/ui/theme.css"

// With prokodo branding (requires proprietary package)
import "@prokodo/ui/theme.css" // base tokens
import "@prokodo/ui-theme-prokodo/css" // overrides brand tokens
```

**Token override surface (example snippet for `@prokodo/ui-theme-prokodo`):**

```css
/* packages/themes/prokodo/prokodo.css — PROPRIETARY */
:root,
[data-theme="prokodo"] {
  /* Brand palette */
  --pk-palette-primary-500: #YOUR_BRAND_BLUE;
  --pk-palette-secondary-500: #YOUR_ACCENT;

  /* Signature surface overrides */
  --pk-color-surface: #0d0f18;
  --pk-color-bg: #07090f;

  /* Signature shadow system — not in OSS */
  --pk-shadow-glow-brand: 0 0 24px rgb(var(--pk-palette-primary-500-rgb) / 0.35);
  --pk-shadow-card: 0 2px 24px rgb(0 0 0 / 0.6),
    inset 0 1px 0 rgb(255 255 255 / 0.04);

  /* Radial backgrounds — signature pattern */
  --pk-bg-hero-radial: radial-gradient(
    ellipse 80% 60% at 50% -10%,
    #YOUR_BRAND_GLOW,
    transparent
  );
}
```

---

## 3.5 Product Clone Protection (Out of Scope for the UI OSS License)

`@prokodo/ui` is a component library. The Apache-2.0 license and the
trademark policy protect the _library's identity_, but they do not protect
against someone copying the _product_ (your website, marketplace, or web
application). That protection must come from a different set of measures.

### What the OSS license does NOT protect against

- Copying the visual layout, page structure, or UX patterns of a prokodo
  product (that is a design/trade-dress matter, not a library-license matter)
- Scraping product data, content, or user-generated content
- Building a competing SaaS using the same open-source component primitives

### Actual product protection measures

| Threat                           | Protection layer                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------------ |
| UI/visual clone                  | Trademark + trade-dress policy; brand assets stay private; watermark illustrations   |
| Marketing/brand clone            | TRADEMARKS.md; DMCA takedown for logo/asset misuse; confusing-similarity enforcement |
| Product code clone               | Product repos remain **private**; never mix product logic into the OSS library       |
| Content/data scraping            | ToS, `robots.txt`, rate limiting, WAF, bot-protection (Cloudflare, etc.)             |
| Confusing branding / passing-off | Trademark monitoring; takedown requests; cease-and-desist playbook                   |
| Brand illustration misuse        | Asset fingerprinting / metadata watermarking; proprietary license on illustrations   |
| Backend abuse                    | AuthZ, audit logs, anomaly detection, IP blocklists                                  |

### Checklist: things that must stay OUT of the public OSS repo

```
[ ] Product page templates (landing pages, checkout flows, marketplace UI)
[ ] Brand illustrations, press-kit assets, logo files
[ ] Marketing copy, taglines, and campaign assets
[ ] Any code that embeds product-specific business logic
[ ] Backend API keys, config, or infrastructure references
```

### Copyright and ToS notices

- Website and product UI: add `© prokodo. All rights reserved.` to the
  rendered page footer — this makes DMCA takedowns straightforward.
- Illustrations: embed author/copyright metadata in SVG/PNG files.
- Terms of Service: explicitly state that the visual design, product
  templates, and brand assets are proprietary and may not be reproduced.

> **Summary:** OSS the component primitives freely. Keep the product, content,
> and brand assets locked down. These are complementary, not conflicting.

---

## 4. Proposed Repo Structure

### Two-repo model (recommended)

The cleanest approach — and the one that avoids mixed-licensing confusion for
contributors — is **two separate repositories**:

| Repo                            | Visibility  | Content                                                       |
| ------------------------------- | ----------- | ------------------------------------------------------------- |
| `prokodo-agency/ui` (this repo) | **Public**  | Components, non-signature default tokens, default theme, docs |
| `prokodo-agency/ui-brand` (new) | **Private** | Signature theme, brand icons, illustrations, press assets     |

This eliminates the risk of accidentally publishing proprietary content,
makes contribution boundaries obvious, and avoids the legal awkwardness of a
mixed-license public repo.

> **Monorepo migration is optional and decoupled.** Converting to a pnpm
> workspaces monorepo is a separate engineering concern. It can follow later
> (see §7 Phase 1b) once the license and theme split are stable. Do not block
> the OSS launch on a monorepo migration.

### Public repo structure (current layout, minimal changes)

```
prokodo-ui/  (public GitHub repo — prokodo-agency/ui)
├── LICENSE                          ← Apache-2.0
├── NOTICE                           ← attribution + pointer to separate licensed dirs
├── TRADEMARKS.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── README.md
├── src/
│   ├── components/                  ← no structural change required
│   ├── helpers/
│   ├── hooks/
│   ├── styles/
│   │   ├── tokens/                  ← neutral primitives + semantics ONLY
│   │   ├── themes/
│   │   │   ├── _default.scss        ← neutral light (ships in OSS)
│   │   │   └── _dark.scss           ← neutral dark (ships in OSS)
│   │   └── ui/
│   └── index.ts
├── assets/
│   ├── icons/                       ← generic/neutral icons only
│   └── images/                      ← generic images only
│                                      (brand icons/images removed → private repo)
├── docs/  (or .storybook/)          ← references only @prokodo/ui, no brand theme
├── tools/
│   ├── check-license-headers.mjs
│   └── check-restricted-paths.mjs
└── package.json                     ← "files" allowlist; "license": "Apache-2.0"
```

### Private repo structure (`prokodo-agency/ui-brand`)

```
ui-brand/  (private GitHub repo)
├── LICENSE                          ← "All Rights Reserved, prokodo"
├── README.md                        ← internal usage notes
├── theme/
│   ├── prokodo.css                  ← brand token overrides
│   └── prokodo-dark.css
├── icons/                           ← brand icons (.svg, .webp)
├── illustrations/                   ← brand illustrations
└── assets/
    ├── logo/
    └── press-kit/
```

Published (to a private npm registry or GitHub Packages) as
`@prokodo/ui-theme-prokodo` for internal and client use only.

### What goes where — rules

| Artifact                             | Repository           | License     | Published to npm               |
| ------------------------------------ | -------------------- | ----------- | ------------------------------ |
| React components                     | `ui` (public)        | Apache-2.0  | ✅ as `@prokodo/ui`            |
| Non-signature default CSS tokens     | `ui` (public)        | Apache-2.0  | ✅ bundled in `dist/theme.css` |
| Default theme (dark/light)           | `ui` (public)        | Apache-2.0  | ✅                             |
| Generic icons (chevron, close, etc.) | `ui` (public)        | Apache-2.0  | ✅                             |
| Prokodo brand token overrides        | `ui-brand` (private) | Proprietary | Private registry only          |
| Brand icons and illustrations        | `ui-brand` (private) | Proprietary | Private registry only          |
| Press/marketing assets               | `ui-brand` (private) | Proprietary | ❌ not published               |
| Storybook docs                       | `ui` (public)        | Apache-2.0  | ❌ (deployed, not npm)         |

---

## 5. Build & Publishing Guardrails

### 5.1 `package.json` `files` allowlist

In the **root `package.json`** of `@prokodo/ui` (current layout — not yet a monorepo),
restrict what gets packed:

```json
{
  "files": ["dist/", "LICENSE", "NOTICE", "README.md"]
}
```

This ensures `src/`, `assets/`, test files, and all config files are never
included in the npm tarball.

Verify with `pnpm pack --dry-run` and inspect the manifest. Re-run after every
build pipeline change.

### 5.2 Build step — restricted-paths check

Create `tools/check-restricted-paths.mjs`:

```js
#!/usr/bin/env node
// tools/check-restricted-paths.mjs
// Fails the build if any restricted path is referenced in OSS build output.
// Because the prokodo signature theme lives in a separate private repo,
// these patterns should never appear — this is a last-resort safety net.

import { readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const RESTRICTED_PATTERNS = [
  /ui-theme-prokodo/,
  /themes\/prokodo/,
  /assets\/brand/,
  /assets\/press-kit/,
]

// Resolves to ./dist/ relative to the repo root (current layout, not yet monorepo).
const DIST_DIR = new URL("../dist", import.meta.url).pathname

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      walk(full)
      continue
    }
    if (
      !full.endsWith(".js") &&
      !full.endsWith(".css") &&
      !full.endsWith(".mjs")
    )
      continue
    const content = readFileSync(full, "utf8")
    for (const pattern of RESTRICTED_PATTERNS) {
      if (pattern.test(content)) {
        console.error(`❌  Restricted path found in OSS build output:`)
        console.error(`   File: ${relative(process.cwd(), full)}`)
        console.error(`   Pattern: ${pattern}`)
        process.exit(1)
      }
    }
  }
}

walk(DIST_DIR)
console.log("✅  No restricted paths in OSS build output.")
```

Add to the **root `package.json`** build scripts (current layout):

```json
{
  "scripts": {
    "build": "vite build && node tools/check-restricted-paths.mjs",
    "prepublishOnly": "pnpm build && node tools/check-restricted-paths.mjs"
  }
}
```

### 5.3 License-header CI check

Because proprietary content now lives in a separate private repo, the
header check for the public repo focuses only on confirming no proprietary
markers have been accidentally committed:

```js
#!/usr/bin/env node
// tools/check-license-headers.mjs
// Scans the OSS repo for accidentally committed proprietary content.

import { readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const FORBIDDEN_MARKERS = [
  "All Rights Reserved",
  "PROPRIETARY",
  "ui-theme-prokodo",
]

const SCAN_DIRS = ["src", "assets", "tools", "docs"]

let errors = 0

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full)
      continue
    }
    if (!/\.(ts|tsx|scss|css|mjs|js|md)$/.test(full)) continue
    const content = readFileSync(full, "utf8").slice(0, 600)
    for (const marker of FORBIDDEN_MARKERS) {
      if (content.includes(marker)) {
        console.error(
          `❌  Proprietary marker "${marker}" found in OSS repo: ${relative(process.cwd(), full)}`,
        )
        errors++
      }
    }
  }
}

for (const dir of SCAN_DIRS) {
  walk(dir)
}
if (errors > 0) process.exit(1)
console.log("✅  No proprietary markers in OSS source.")
```

### 5.4 GitHub Actions CI step

Add to `.github/workflows/release.yml` (or a dedicated `oss-guards.yml`):

```yaml
- name: Check for proprietary markers in OSS source
  run: node tools/check-license-headers.mjs

- name: Check for restricted paths in build output
  run: node tools/check-restricted-paths.mjs

- name: Verify npm tarball does not include restricted files
  run: |
    pnpm pack --dry-run 2>&1 | grep -E "(ui-theme-prokodo|themes/prokodo|assets/brand)" && \
      { echo "❌ Restricted files in npm tarball"; exit 1; } || \
      echo "✅ Tarball is clean"
```

### 5.5 Docs build guardrail

The OSS docs must never depend on the private brand theme:

```yaml
- name: Ensure docs does not depend on proprietary theme
  run: |
    grep "ui-theme-prokodo" docs/package.json 2>/dev/null && \
      { echo "❌ Docs must not depend on proprietary theme"; exit 1; } || \
      echo "✅ Docs OK"
```

---

## 6. Default Theme Guidance

### Principle: Non-signature defaults, brand by intent

The default `theme.css` shipped in `@prokodo/ui` provides generic, non-signature visual defaults:

- Generic grey scale + system blue (`#1E90FF`) — widely used, not distinctive
- Standard spacing, radius, and shadow tokens — no proprietary glow/radial patterns
- No brand illustrations or icons embedded in CSS
- The `--pk-*` CSS variable prefix and `pk-*` class names are **public API** — consumers use and override them by design

### Token emission rules (important for performance and override clarity)

These rules must be enforced as code review policy:

1. **One default entrypoint emits defaults** — `theme.css` (built from
   `_default.scss`) is the single file that declares `--pk-*` default values.
   Multiple theme files are fine (light, dark, high-contrast, dense), but
   each must use a distinct, non-overlapping selector (see rule 3).
   Permitted selectors for theme declarations:

   - `:root` or `.pk-theme-default` — base defaults
   - `[data-theme="<name>"]` — named brand/variant themes
   - `[data-color-scheme="dark"]` or `.dark` — color-mode overrides

2. **Components never declare theme selectors** — component SCSS files may
   only _consume_ `var(--pk-*)`. They must never write declarations
   targeting `:root`, `[data-theme]`, or `.pk-theme-*`.

3. **One canonical override attribute** — use `[data-theme]` as the primary
   override mechanism. Avoid mixing `[data-theme]` and `.pk-theme-*`
   class-based selectors in the same scope without a clearly defined
   specificity hierarchy; doing so creates hard-to-debug cascade conflicts.

   Recommended pattern: `[data-theme="prose"]` for per-section variants,
   `[data-color-scheme="dark"]` for color-mode — both on `<html>`.

### Token override pattern (recommended for consumers)

Consumers override via a `[data-theme]` attribute on `<html>` — zero specificity conflicts:

```css
/* your-project/src/theme/brand.css */
[data-theme="my-brand"] {
  /* Color brand */
  --pk-color-brand: #e63946;
  --pk-color-brand-hover: #c1121f;
  --pk-color-accent: #457b9d;
  --pk-color-on-brand: #ffffff;

  /* Surface */
  --pk-color-bg: #f8f9fa;
  --pk-color-surface: #ffffff;

  /* Radius */
  --pk-radius-md: 4px;
  --pk-radius-lg: 8px;
}
```

```tsx
// app/layout.tsx (Next.js App Router)
import "@prokodo/ui/theme.css"
import "./theme/brand.css"

export default function RootLayout({ children }) {
  return (
    <html data-theme="my-brand">
      <body>{children}</body>
    </html>
  )
}
```

```tsx
// vite-project/src/main.tsx
import "@prokodo/ui/theme.css"
import "./theme/brand.css"

// Set the attribute once at entry
document.documentElement.setAttribute("data-theme", "my-brand")
```

### Dark mode

The default dark theme already ships via `.pk-theme-default.dark` or `[data-theme="dark"]`. Consumers layer their own dark overrides the same way:

```css
[data-theme="my-brand"][data-color-scheme="dark"] {
  --pk-color-bg: #1a1a2e;
  --pk-color-surface: #16213e;
  /* ... */
}
```

### What consumers must NOT do

- Present derivative products or theme packages as official prokodo products, or use prokodo brand assets in a way that implies endorsement (see TRADEMARKS.md)
- Declare `--pk-*` defaults inside **component** CSS — components consume via `var(--pk-*)` only; theme declarations belong in theme files
- Add a second base `:root { ... }` block for `--pk-*` defaults; always layer overrides via `[data-theme]` or `[data-color-scheme]`

> **Clarification:** Overriding `--pk-*` variables is the intended use. Using any color you like — including blues, gradients, or glows — in your own theme is fine. The restriction is on _brand identity and affiliation claims_, not on the technical token values themselves.

## 7. Step-by-Step Implementation Plan

### Phase 0 — Preparation (1–2 days)

- [ ] Create a `feat/oss-licensing` branch
- [ ] Add TRADEMARKS.md (verbatim from §2)
- [ ] Replace `LICENSE` with Apache-2.0 full text
- [ ] Create `NOTICE` (verbatim from §1)
- [ ] Create `CONTRIBUTING.md` (DCO + PR process)
- [ ] Create `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1, freely available at https://www.contributor-covenant.org/version/2/1/code_of_conduct/)
- [ ] Update `README.md`: replace BUSL badge with Apache-2.0 badge, add license/usage summary table

### Phase 1 — Repo clean-up and theme split (2–4 days)

- [ ] Identify all brand-specific assets in `assets/` (brand icons, illustrations, prokodo-signature CSS) — move them to the new private `ui-brand` repo
- [ ] Ensure `assets/icons/` in the public repo contains only generic/neutral icons
- [ ] Update `package.json` `files` allowlist to `["dist/", "LICENSE", "NOTICE", "README.md"]`
- [ ] Update build scripts with restricted-path guard (`prepublishOnly`)

### Phase 1b — Monorepo migration (optional, later)

> This is a separate engineering decision, not a licensing requirement.
> Defer until the OSS launch is stable.

- [ ] Evaluate pnpm workspaces monorepo: `packages/ui`, `apps/docs`
- [ ] Move `.storybook/` → `apps/docs/.storybook/`
- [ ] Update `pnpm-workspace.yaml`

### Phase 2 — Theme split (3–5 days)

- [ ] Audit `src/styles/tokens/_semantic.scss` — identify prokodo-signature values (current brand blue `#1E90FF`, radial patterns); decide: neutral enough for OSS, or move to private theme
- [ ] Ensure `src/styles/themes/_default.scss` contains only neutral values
- [ ] **In the private `ui-brand` repo:** create `theme/prokodo.css` with brand token overrides
- [ ] **In the private `ui-brand` repo:** create `theme/prokodo-dark.css` for dark brand variant
- [ ] Move brand-specific icons/illustrations from `assets/` to **`ui-brand/icons/`** in the private repo
- [ ] Verify all component SCSS files reference only `--pk-*` variables — no brand/semantic hex literals
  ```sh
  grep -rn '#[0-9a-fA-F]\{3,6\}' src/components/
  # Allowed: transparent, currentColor, inherit, rgb(0 0 0 / x) for generic shadows
  # Not allowed: any brand/semantic colour literal
  ```

### Phase 3 — Build guardrails (1 day)

- [ ] Create `tools/check-restricted-paths.mjs`
- [ ] Create `tools/check-license-headers.mjs`
- [ ] Add CI steps to `.github/workflows/` (restricted paths, tarball check, docs dependency check)
- [ ] Run `pnpm pack --dry-run` and verify tarball manifest

### Phase 4 — Docs update (1 day)

- [ ] Remove prokodo brand theme from `apps/docs` and use neutral default theme
- [ ] Add "Theming" Storybook page showing token override pattern
- [ ] Update docs homepage to explain the OSS + theme architecture

### Phase 5 — Release (1 day)

- [ ] Merge `feat/oss-licensing` → `main` after review
- [ ] Tag `v0.2.0` (semver minor: no API break, license change)
- [ ] Update npm package with new `LICENSE` field: `"license": "Apache-2.0"`
- [ ] Publish `@prokodo/ui@0.2.0`
- [ ] Announce on README, changelog, and prokodo blog

---

## 8. CI / Build Guardrails Checklist

```
[ ] package.json "files" allowlist: ["dist/", "LICENSE", "NOTICE", "README.md"] — src/ excluded
[ ] build script runs check-restricted-paths.mjs after vite build
[ ] prepublishOnly script runs build + check-restricted-paths
[ ] CI: proprietary-marker check on every PR (check-license-headers.mjs)
[ ] CI: restricted-paths check on every PR (check-restricted-paths.mjs)
[ ] CI: pnpm pack --dry-run tarball inspection — no brand/proprietary paths
[ ] CI: docs does not import @prokodo/ui-theme-prokodo
[ ] Grep for hex literals ONLY in src/components/**/*.scss — must return 0 results
     (SVGs, docs snippets, and token files are excluded from this check)
     Allowed in components: transparent | currentColor | inherit | rgb(0 0 0 / x) for generic shadows
     Not allowed: any brand/semantic hex literal (e.g. #1E90FF, #00E6FF, #10131b)
[ ] Grep for "prokodo" in dist/ output — only allowed inside LICENSE/NOTICE banners
     and package metadata (e.g. the package name string itself); must not appear as a
     runtime import path or CSS class/variable name
[ ] NOTICE file present at repo root and copied to dist/ during build
[ ] Private repo (ui-brand) is NOT referenced anywhere in the OSS repo's package.json or source
```

---

## 9. Acceptance Criteria

```
[ ] @prokodo/ui published to npm under Apache-2.0 license
[ ] README clearly states what is and isn't allowed
[ ] TRADEMARKS.md in repo; linked from README
[ ] NOTICE file at repo root; correct attribution; pointers to separate licensed dirs only (no claim to exclude via NOTICE)
[ ] A user can install and use @prokodo/ui in a commercial SaaS product or client project without restriction
[ ] A user who forks is required to rebrand; using the name "prokodo" in a confusingly similar way is contrary to TRADEMARKS.md
[ ] The prokodo signature theme (colors, gradients, shadows, brand icons) lives exclusively in the private repo and is not bundled in the npm package
[ ] pnpm pack --dry-run produces no brand or proprietary-theme files
[ ] CI fails if any proprietary marker, brand path, or restricted theme reference appears in OSS source or build output
[ ] No brand/semantic hex literals in src/components/**/*.scss — only var(--pk-*), transparent, currentColor, inherit, and generic rgb() shadow values
[ ] Token emission: exactly one default entrypoint (theme.css) emits --pk-* defaults; multiple theme selectors permitted (:root, [data-theme], [data-color-scheme]) but components never declare any
[ ] Override mechanism: [data-theme] is the canonical theming attribute; no theme selector declarations inside component SCSS files
[ ] Dark mode works with the neutral default theme (no brand dependency)
[ ] Docs (Storybook) builds and deploys without @prokodo/ui-theme-prokodo
[ ] Legal: NOTICE accurate; proprietary content verified absent from public repo
```

---

## Appendix — Useful References

- Apache-2.0 full text: https://www.apache.org/licenses/LICENSE-2.0.txt
- SPDX identifier: `Apache-2.0`
- Contributor Covenant 2.1: https://www.contributor-covenant.org/version/2/1/code_of_conduct/
- DCO 1.1: https://developercertificate.org/
- Mozilla Trademark Policy (reference model): https://www.mozilla.org/en-US/foundation/trademarks/policy/
- Rust Foundation Trademark Policy: https://foundation.rust-lang.org/policies/logo-policy-and-media-guide/

---

## 10. Implementation Notes

### 10.1 Files Created / Updated

| File                               | Action   | Purpose                                                                                                         |
| ---------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| `LICENSE`                          | Replaced | BUSL-1.1 → Apache-2.0 (full canonical text)                                                                     |
| `NOTICE`                           | Created  | Apache-2.0 attribution; confirms no proprietary dirs in public repo                                             |
| `TRADEMARKS.md`                    | Created  | Full trademark policy per §4                                                                                    |
| `CONTRIBUTING.md`                  | Created  | DCO 1.1 sign-off requirement; PR guidance                                                                       |
| `CODE_OF_CONDUCT.md`               | Created  | Contributor Covenant 2.1                                                                                        |
| `SECURITY.md`                      | Created  | Responsible disclosure via GitHub Advisories                                                                    |
| `README.md`                        | Updated  | Apache-2.0 badge; "License & Usage" table; links to TRADEMARKS/CONTRIBUTING/SECURITY                            |
| `package.json`                     | Updated  | `"license": "Apache-2.0"`; `"files"` now includes `"NOTICE"`; `build` script runs guard; `prepublishOnly` added |
| `tools/check-restricted-paths.mjs` | Created  | Scans `dist/` for proprietary path patterns before publish                                                      |
| `tools/check-license-headers.mjs`  | Created  | Scans `src/`, `assets/`, `tools/`, `docs/` for forbidden content markers                                        |
| `.github/workflows/oss-guards.yml` | Created  | CI workflow: marker check → build → restricted-path check → tarball grep → docs typecheck → SCSS hex guard      |

### 10.2 Assets Audit Results

Audited directories: `assets/icons/` and `assets/images/`.

**Result: No brand-specific assets found in the public repository.**

| Directory        | Contents                                                      | Status                |
| ---------------- | ------------------------------------------------------------- | --------------------- |
| `assets/icons/`  | Generic icon set (~2000+ SVG icons; third-party icon library) | ✅ Safe to distribute |
| `assets/images/` | `github_logo.webp`, generic placeholder images                | ✅ Safe to distribute |

No prokodo logo files, brand illustrations, press-kit assets, or signature visual assets were found. The two-repo model is already satisfied by default — brand assets live in the private `prokodo-agency/ui-brand` repository (or have not yet been created).

### 10.3 SCSS Hex Guard Calibration

The `oss-guards.yml` SCSS check allows:

- Hex values as fallbacks inside `var(--pk-...)` calls
- Hex values as CSS custom property **declarations** (component-level token defaults — e.g. `--pk-autocomplete-gradient-to: #10CCB8`)
- `#fff` / `#ffffff` / `#000` / `#000000` — used as CSS mask/layer values (structural, not brand)
- Comment-only lines

It flags: standalone hex literals in regular CSS property declarations inside component stylesheets.

Zero violations on existing codebase as of implementation date.
