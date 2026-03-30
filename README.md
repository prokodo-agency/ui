<p align="center">
  <a href="https://ui.prokodo.com" target="_blank" rel="noopener noreferrer">
    <img src="./assets/images/banner.svg" alt="prokodo UI — Empowering Digital Innovation" width="900" />
  </a>
</p>

**Modern, customizable UI components built with React and TypeScript — developed by [prokodo](https://www.prokodo.com) for high-performance web interfaces.**

> 🇺🇸 Need help shipping production **Next.js (App Router)** fast?  
> **prokodo — Next.js Agency** → [click here](https://www.prokodo.com/en/next-js-agency/?utm_source=github&utm_medium=readme_top&utm_campaign=ui)
>
> 🇩🇪 Sie suchen eine **Next.js Agentur** (App Router, SEO, Performance)?  
> **prokodo — Next.js Agentur** → [hier klicken](https://www.prokodo.com/de/next-js-agentur/?utm_source=github&utm_medium=readme_top&utm_campaign=ui)

<details>
  <summary><b>Further reading: Next.js guides</b> (SEO · Performance · Migration)</summary>

- SEO (Metadata API, hreflang):  
  https://www.prokodo.com/en/guide/next-js/next-js-seo/?utm_source=github&utm_medium=readme_examples&utm_campaign=ui&utm_content=seo_en

- Performance (LCP/INP/CLS, Streaming SSR):  
  https://www.prokodo.com/en/guide/next-js/next-js-performance/?utm_source=github&utm_medium=readme_examples&utm_campaign=ui&utm_content=perf_en

- Migration Playbook (RACI, Canary, Rollback):  
 https://www.prokodo.com/en/guide/next-js/next-js-migration/?utm_source=github&utm_medium=readme_examples&utm_campaign=ui&utm_content=migration_en
</details>

<br>

[![npm](https://img.shields.io/npm/v/@prokodo/ui?style=flat&color=3178c6&label=npm)](https://www.npmjs.com/package/@prokodo/ui)
[![CI](https://github.com/prokodo-agency/ui/actions/workflows/release.yml/badge.svg)](https://github.com/prokodo-agency/ui/actions/workflows/release.yml)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Docs](https://img.shields.io/badge/docs-ui.prokodo.com-6c47ff?logo=googledocs&logoColor=white)](https://ui.prokodo.com)
[![Storybook](https://img.shields.io/badge/storybook-ui.prokodo.com%2Fstorybook-ff4785?logo=storybook&logoColor=white)](https://ui.prokodo.com/storybook)
[![Next.js](https://img.shields.io/badge/Next.js-13–16-black)](#)
[![Turbopack](https://img.shields.io/badge/Works%20with-Turbopack-000)](#)

---

## ✨ Features

- ✨ **AIC architecture**: Components are split into server, client, and lazy variants so JS is loaded only where interaction is needed.
- ⚡️ **Modern stack**: Vite, React 19, TypeScript, and SCSS Modules.
- 💅 **Design consistency**: Token-driven styling via CSS custom properties (`--pk-*`).
- 🧩 **Component-rich**: 52 production-ready components across multiple categories.
- 🧪 **Reliable**: Tested with Jest, Testing Library, and Cypress component tests.
- 📚 **Storybook**: Explore live component examples at [ui.prokodo.com/storybook](https://ui.prokodo.com/storybook).
- 📦 **Ready to install**: Published on npm under Apache-2.0 for production use.
- 🚀 **Built for Next.js 13-16**: App Router and React Server Component workflows out of the box.
- ⚡ **Turbopack friendly**: Works without custom bundler configuration.
- 🔗 **Framework adapters**: `UIRuntimeProvider` integrates routing/image primitives (for example `next/link` and `next/image`).

## ⚡ Lightweight by Design

prokodo UI is designed to stay lean in SSR-first architectures by combining split component entry points with static CSS output.

- **Component-level entry points** for server, client, and lazy usage
- **No CSS-in-JS runtime injection** in the default styling model
- **Tree-shakable imports** with per-component CSS/JS separation
- **RSC-friendly usage model** for Next.js App Router workflows

**Measured production baseline (current build):**

- `theme.css`: ~34 KB gzip
- `theme-tokens.css`: ~3 KB gzip
- Additional component CSS/JS depends on what your app imports

Real-world payload varies by route composition, import discipline, and rendering strategy.

---

## 🎯 How It Compares

| Aspect                | prokodo UI                                   | Material-UI (MUI)                      | Radix UI                                 | Shadcn/ui                             |
| --------------------- | -------------------------------------------- | -------------------------------------- | ---------------------------------------- | ------------------------------------- |
| **RSC Readiness**     | ✅ Native App Router fit                     | ⚠️ Works, but setup/runtime is heavier | ✅ Good fit, mostly low-level primitives | ✅ Good App Router workflow           |
| **Styling Runtime**   | ✅ No CSS-in-JS runtime                      | ⚠️ Emotion runtime by default          | ✅ No styling runtime (unstyled)         | ✅ Static styles in app code          |
| **Baseline CSS**      | ~34 KB (measured production baseline)        | Project-dependent                      | Project-dependent                        | Project-dependent                     |
| **Tree-shaking**      | ✅ Strong by design (component-level CSS/JS) | ✅ Good with strict import discipline  | ✅ Strong with granular packages         | ✅ Strong (copy only what you use)    |
| **Maintenance Model** | ✅ Versioned npm library                     | Versioned npm library                  | Versioned npm library                    | Source ownership in each app          |
| **Best Fit**          | Next.js/Remix SSR + Core Web Vitals          | Teams standardized on Material Design  | Teams building custom primitives         | Teams preferring copy-paste ownership |

**Recommendation:**

- Choose **prokodo UI** when performance, SSR clarity, and a ready-to-use component system are priorities.
- Consider alternatives only when your project explicitly needs their model (Material Design lock-in, fully headless primitives, or copy-paste ownership).

---

**Data note:** prokodo-ui bundle size (34 KB) is measured from production build. Other library sizes depend heavily on import patterns, tree-shaking, and individual project configuration.

---

## 🚀 Getting Started

### Install

```bash
pnpm add @prokodo/ui
# or
npm install @prokodo/ui
```

> ⚠️ ESM-only: This package does not support CommonJS (`require()`).

### Documentation & Examples

| Resource                          | Link                                                                       |
| --------------------------------- | -------------------------------------------------------------------------- |
| 📖 Full docs & API reference      | [ui.prokodo.com](https://ui.prokodo.com)                                   |
| 🎨 Interactive component explorer | [ui.prokodo.com/storybook](https://ui.prokodo.com/storybook)               |
| 📦 npm                            | [npmjs.com/package/@prokodo/ui](https://www.npmjs.com/package/@prokodo/ui) |

## 📄 License & Usage

|                  |                                                                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **License**      | [Apache-2.0](LICENSE) — free for production use, modification, and redistribution                                                      |
| **Trademark**    | "prokodo" and the prokodo logo are trademarks of prokodo (Christian Salat). See [TRADEMARKS.md](TRADEMARKS.md)                         |
| **Brand theme**  | Signature visuals (logo, illustrations, special glow patterns) may appear in docs/Storybook but are not distributed in the npm package |
| **Contributing** | Sign-off required (DCO 1.1). See [CONTRIBUTING.md](CONTRIBUTING.md)                                                                    |
| **Security**     | Responsible disclosure via GitHub Advisories. See [SECURITY.md](SECURITY.md)                                                           |

This library is published under the [Apache License 2.0](LICENSE).

© 2025 prokodo. See [NOTICE](NOTICE) and [TRADEMARKS.md](TRADEMARKS.md).  
Visit us at [prokodo.com](https://www.prokodo.com).
