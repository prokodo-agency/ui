<p align="center">
  <a href="https://www.prokodo.com" target="_blank" rel="noopener noreferrer">
    <img src="https://cdn.prokodo.com/prokodo_logo_1a3bb7867c/prokodo_logo_1a3bb7867c.webp" alt="prokodo – UI component library for React" height="58" />
  </a>
</p>
<h1 align="center">prokodo UI (Beta)</h1>
<h2 align="center">Empowering Digital Innovation</h2>

**Modern, customizable UI components built with React and TypeScript — developed by [prokodo](https://www.prokodo.com) for high-performance web interfaces.**

> 🇺🇸 Need help shipping a production **Next.js + Headless CMS** in 4–6 weeks?  
> **prokodo — Next.js CMS agency** → [click here](https://www.prokodo.com/en/solution/next-js-cms?utm_source=github&utm_medium=readme_top)
>
> 🇩🇪 Sie suchen eine **Next.js Agentur** (Strapi/Contentful/WP)?  
> **prokodo — Next.js CMS Agentur** → [hier klicken](https://www.prokodo.com/de/loesung/next-js-cms?utm_source=github&utm_medium=readme_top)

[![npm](https://img.shields.io/npm/v/@prokodo/ui?style=flat&color=3178c6&label=npm)](https://www.npmjs.com/package/@prokodo/ui)
[![CI](https://github.com/prokodo-agency/ui/actions/workflows/release.yml/badge.svg)](https://github.com/prokodo-agency/ui/actions/workflows/release.yml)
[![License: BUSL-1.1](https://img.shields.io/badge/license-BUSL--1.1-blue.svg)](LICENSE)
[![Storybook](https://img.shields.io/badge/storybook-ui.prokodo.com-ff4785?logo=storybook&logoColor=white)](https://ui.prokodo.com)
[![bundlephobia](https://img.shields.io/bundlephobia/minzip/@prokodo/ui?label=bundle%20size&style=flat&color=blue)](https://bundlephobia.com/result?p=@prokodo/ui)

---

## ✨ Features

- ✨ **Adaptive Island Components (AIC)**: A rendering strategy where each component loads only the JavaScript it needs — when needed.
- ⚡️ **Modern stack**: Vite, React 19, TypeScript, and SCSS Modules
- 💅 **Design consistency**: Theming via design tokens and BEM-style naming
- 🧩 **Component-rich**: 40+ reusable UI components
- 🧪 **Reliable**: Fully tested with Jest and Testing Library
- 📚 **Storybook**: Explore the components at [ui.prokodo.com](https://ui.prokodo.com)
- 📦 **Ready-to-install**: Distributed via npm for non-production use under the BUSL-1.1 license
- 🧱 **Optimized for SSR**: Works great with Next.js and React Server Components

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

### 1. Install the package

> ⚠️ ESM-only: This package does not support CommonJS (`require()`).

```bash
pnpm add @prokodo/ui
# or
npm install @prokodo/ui
```

### 2. Use a component

#### React

```tsx
import { Button, type ButtonProps } from "@prokodo/ui/button";

export default function Layout() {
  // Renders to HTML on the server with zero‐JS.
  // On the client, it will hydrate when scrolled into view or the user interacts.
  return <Button title="Click me"/>;
}
```


#### Next.js (RSC + AIC, lazy‐hydrate when visible/interacted)

```tsx
import { Button, type ButtonProps } from "@prokodo/ui/button";

export default function Layout() {
  // Renders to HTML on the server with zero‐JS.
  // On the client, it will hydrate when scrolled into view or the user interacts.
  return <Button title="Click me"/>;
}
```

#### Next.js (RSC + AIC, force immediate hydration with priority)

```tsx
import { Button, type ButtonProps } from "@prokodo/ui/button";

export default function AboveTheFoldHero() {
  // Because this lives above the fold, we want it to hydrate right away:
  return <Button priority title="Welcome to prokodo"/>;
}
```

#### Next.js ("use client" wrapper, immediate hydration - above the fold)

```tsx
"use client";

import { Button, type ButtonProps } from "@prokodo/ui/button";
import { type FC, memo } from "react";

// In a pure‐client file, you can wrap the AIC export.
// The `priority` prop here ensures hydration runs immediately when mounted.
export const HeadlineClient: FC<ButtonProps> = memo((props) => {
  return <Button {...props} priority />;
});
```

#### Next.js (hydrate on visibility only, default behavior)

```tsx
import { Headline, type ButtonProps } from "@prokodo/ui/button";

export default function GalleryPage() {
  return (
    <div style={{ height: "200vh" }}>
      <p>Keep scrolling…</p>
      <div style={{ marginTop: "100vh" }}>
        {/* This will render as HTML on the server;
            on the client, it only hydrates when this element scrolls into view. */}
        <Button title="I hydrate when you see me"/>
      </div>
    </div>
  );
}
```

## 📦 Available Components

### Compatibility of the components

- ✅ = Available as AIC (renders zero-JS RSC and self-hydrates when needed) and can also be used as a client‐only entry.
- \- = RSC (AIC) only; no client‐side bundle needed. (Usable in both, but best practice to use in RSC only)

| Component             | ✅ AIC (RSC + optional client)   | ✅ SSR-Compatible (`"use client"`) |
|-----------------------|:--------------------------------:|:---------------------------------:|
| Accordion             | ✅                               | ✅                                 |
| Animated              | ✅                               | ✅                                 |
| AnimatedText          | ✅                               | ✅                                 |
| Avatar                | ✅                               | ✅                                 |
| BaseLink              | ✅                               | ✅                                 |
| Button                | ✅                               | ✅                                 |
| Calendly              | ✅                               | ✅                                 |
| Card                  | ✅                               | ✅                                 |
| Carousel              | ✅                               | ✅                                 |
| Chip                  | ✅                               | ✅                                 |
| DatePicker            | ✅                               | ✅                                 |
| Dialog                | ✅                               | ✅                                 |
| Drawer                | ✅                               | ✅                                 |
| DynamicList           | ✅                               | ✅                                 |
| Form                  | ✅                               | ✅                                 |
| FormResponse          | ✅                               | –                                  |
| Grid/GridRow          | ✅                               | –                                  |
| Headline              | ✅                               | -                                  |
| Icon                  | ✅                               | –                                  |
| Image                 | ✅                               | –                                  |
| ImageText             | ✅                               | -                                  |
| Input                 | ✅                               | ✅                                 |
| Label                 | ✅                               | –                                  |
| Link                  | ✅                               | ✅                                 |
| List                  | ✅                               | –                                  |
| Loading               | ✅                               | –                                  |
| Lottie                | ❌                               | ✅                                 |
| Map                   | ❌                               | ✅                                 |
| PostItem              | ❌ (Experimental - Coming soon)  | –                                  |
| PostTeaser            | ❌ (Experimental - Coming soon)  | –                                  |
| PostWidget            | ❌ (Experimental - Coming soon)  | –                                  |
| PostWidgetCarousel    | ❌ (Experimental - Coming soon)  | -                                  |
| ProgressBar           | ✅                               | ✅                                 |
| Quote                 | ✅                               | –                                  |
| RichText              | ✅                               | ✅                                 |
| Select                | ✅                               | ✅                                 |
| SideNav               | ✅                               | ✅                                 |
| Skeleton              | ✅                               | –                                  |
| Slider                | ✅                               | ✅                                 |
| Snackbar & Provider   | ✅                               | ✅                                 |
| Stepper               | ✅                               | ✅                                 |
| Switch                | ✅                               | ✅                                 |
| Table                 | ✅                               | –                                  |
| Teaser                | ✅                               | -                                  |

## How to create my own Island Component?

### 1. Create your island component (Navbar.tsx):

Island architecture lets you render components on the server and hydrate them on the client only when needed.

```tsx
import { createIsland } from '@prokodo/ui/createIsland';
import { NavbarServer } from './Navbar.server';

import type { NavbarProps } from './Navbar.model';

export const Navbar = createIsland<NavbarProps>({
  name: 'Navbar',
  Server: NavbarServer,
  loadLazy: () => import('./Navbar.lazy'),

  // Optional: Force client-side hydration as soon as someone uses an action
  // We are automatically recognizing onChange, onKeyDown, ... events. Only needed for custom attributes.
  isInteractive: (p: NavbarProps) => p.customEvent === true,
});

```

### 2. Create your lazy-hydrate wrapper (Navbar.lazy):

```tsx
'use client'
import { createLazyWrapper } from '@prokodo/ui/createLazyWrapper';

import { NavbarClient } from './Navbar.client';
import { NavbarServer } from './Navbar.server';

import type { NavbarProps } from './Navbar.model';

export default createLazyWrapper<NavbarProps>({
  name: 'Navbar',
  Client: NavbarClient,
  Server: NavbarServer,

  // Optional: Defer hydration until the component becomes visible in the viewport (Default: true)
  // Can be controlled by priority attribute.
  hydrateOnVisible: false,

  // Optional: Force client-side hydration as soon as someone uses an action.
  // We are automatically recognizing onChange, onKeyDown, ... events. Only needed for custom attributes.
  isInteractive: (p: NavbarProps) => p.customEvent === true,
});

```

## 🎯 Next steps

- [ ] Add more ✨ **fancy styling**, UI polish and properties
- [ ] Improve **accessibility** to meet **WCAG 2.2 AAA** standards
- [ ] Detailed Documentation about the components

## Examples (Next.js + Headless CMS)

- Next.js + **Strapi** content models  
- Next.js + **Contentful** entries & preview  
- Migration from **Headless WordPress** to Next.js  

Compare CMS options → [Strapi vs Contentful vs Headless WP](https://www.prokodo.com/de/loesung/next-js-cms?utm_source=github&utm_medium=readme_examples)

## 📘 Documentation

Explore all components and examples in the official Storybook:

👉 https://ui.prokodo.com

## 🛠 Local Development

```bash
pnpm i
pnpm dev          # Start Vite dev server
pnpm storybook    # Start Storybook locally
```

To build:
```bash
pnpm run build
pnpm run storybook:build
```

## 📄 License
This library is published under the Business Source License 1.1 (BUSL-1.1).

© 2025 prokodo — All rights reserved.
Visit us at [prokodo.com](https://www.prokodo.com).