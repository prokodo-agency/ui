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

- ✨ **Adaptive Island Components (AIC)**: A rendering strategy where each component loads only the JavaScript it needs — when needed.
- ⚡️ **Modern stack**: Vite, React 19, TypeScript, and SCSS Modules
- 💅 **Design consistency**: Theming via design tokens and BEM-style naming
- 🧩 **Component-rich**: 50+ reusable UI components
- 🧪 **Reliable**: Fully tested with Jest and Testing Library
- 📚 **Storybook**: Explore the components at [ui.prokodo.com](https://ui.prokodo.com)
- 📦 **Ready-to-install**: Distributed via npm under the Apache-2.0 license — free for production use
- 🚀 **Optimized for Next.js 13–16 out of the box** (App Router, React Server Components)
- ⚡ **Turbopack compatible** (no config required)
- 🔗 **Framework adapters** via `UIRuntimeProvider` for `next/link` & `next/image`

## ⚡ Lightweight by Design

Adaptive Island Components (AIC) are fully modular and optimized for modern frameworks (Next.js, Remix, etc.).  
Each component is built for **lazy loading**, works seamlessly with **React Server Components (RSC)**, and can be **tree-shaken** out when unused.

**Total bundle (all components): ~195 kB gzipped**

- **Only 5–20 kB** are typically loaded per page
- **Zero-JS on initial render** for most components
- **Hydration is deferred** until interaction or visibility
- Shared styles are minimal: **only ~16.5 kB gzipped**

This makes `@prokodo/ui` ideal for modern SSR apps using Next.js or Remix, with excellent Time-to-Interactive (TTI) and Core Web Vitals.

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
