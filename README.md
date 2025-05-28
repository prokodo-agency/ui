<p align="center">
  <a href="https://www.prokodo.com" target="_blank" rel="noopener noreferrer">
    <img src="https://cdn.prokodo.com/prokodo_logo_1a3bb7867c/prokodo_logo_1a3bb7867c.webp" alt="prokodo – UI component library for React" height="58" />
  </a>
</p>
<h1 align="center">prokodo UI (Beta)</h1>
<h2 align="center">Empowering Digital Innovation</h2>

**Modern, customizable UI components built with React and TypeScript — developed by [prokodo](https://www.prokodo.com) for high-performance web interfaces.**

[![npm](https://img.shields.io/npm/v/@prokodo/ui?style=flat&color=3178c6&label=npm)](https://www.npmjs.com/package/@prokodo/ui)
[![CI](https://github.com/prokodo-agency/ui/actions/workflows/release.yml/badge.svg)](https://github.com/prokodo-agency/ui/actions/workflows/release.yml)
[![License: BUSL-1.1](https://img.shields.io/badge/license-BUSL--1.1-blue.svg)](LICENSE)
[![Storybook](https://img.shields.io/badge/storybook-ui.prokodo.com-ff4785?logo=storybook&logoColor=white)](https://ui.prokodo.com)
[![bundlephobia](https://img.shields.io/bundlephobia/minzip/@prokodo/ui?label=bundle%20size&style=flat&color=blue)](https://bundlephobia.com/result?p=@prokodo/ui)

---

## ✨ Features

- ✨ **Adaptive-Island Components (AIC)**: One import per component. Renders as zero-JS RSC and self-hydrates *only* when interaction is detected & the element is visible. (Currently in Beta for Button)
- ⚡️ **Modern stack**: Vite, React 19, TypeScript, and SCSS Modules
- 💅 **Design consistency**: Theming via design tokens and BEM-style naming
- 🧩 **Component-rich**: 35+ reusable UI components
- 🧪 **Reliable**: Fully tested with Jest and Testing Library
- 📚 **Storybook**: Explore the components at [ui.prokodo.com](https://ui.prokodo.com)
- 📦 **Ready-to-install**: Distributed via npm for non-production use under the BUSL-1.1 license
- 🧱 **Optimized for SSR**: Works great with Next.js and React Server Components

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

#### Next.js (RSC)

```tsx
import { Headline, type HeadlineProps } from "@prokodo/ui/button"

export default function Layout() {
  return <Headline>Click me</Headline>
}
```

#### Next.js (Client optimized)

```tsx
import { HeadlineClient, type HeadlineProps } from "@prokodo/ui/button"

export default function Layout() {
  return <HeadlineClient>Click me</HeadlineClient>
}
```

#### Next.js (Client non-optimized, means RSC only)

```tsx
"use client"
import { Headline as UIHeadline, type HeadlineProps } from "@prokodo/ui/button"
import { type FC, memo } from "react"

export const Headline: FC<HeadlineProps> = memo(props => <UIHeadline {...props} />)
```

## 📦 Available Components

### Compatibility of the components

✅ = Available as RSC (<[ComponentName] />) and for client exportable (<[ComponentName]Client />)
❌ = Not available
\- = Currently only for RSC optimized

> If RSC and client have ✅-symbol means available as RSC (<[ComponentName] />) & extra client export (<[ComponentName]Client />)

| Komponente             | 🧠 RSC-Compatible (`app/layout.tsx`) | 💡 SSR-Compatible (`"use client"`) |
|------------------------|:------------------------------------:|:----------------------------------:|
| Accordion              | ❌                                   | ✅                                 |
| Animated               | ❌                                   | ✅                                 |
| AnimatedText           | ❌                                   | ✅                                 |
| Avatar                 | ❌                                   | ✅                                 |
| BaseLink               | ❌                                   | ✅                                 |
| Button                 | ❌                                   | ✅                                 |
| Calendly               | ❌                                   | ✅                                 |
| Card                   | ❌                                   | ✅                                 |
| Carousel               | ❌                                   | ✅                                 |
| Chip                   | ❌                                   | ✅                                 |
| DatePicker             | ❌                                   | ✅                                 |
| Dialog                 | ❌                                   | ✅                                 |
| Drawer                 | ❌                                   | ✅                                 |
| Form                   | ❌                                   | ✅                                 |
| FormResponse           | ✅                                   | –                                  |
| Grid                   | ✅                                   | –                                  |
| GridRow                | ✅                                   | –                                  |
| Headline               | ✅                                   | ✅                                 |
| Icon                   | ✅                                   | –                                  |
| Image                  | ✅                                   | –                                  |
| ImageText              | ❌                                   | ✅                                 |
| Input                  | ❌                                   | ✅                                 |
| InputOTP               | ❌                                   | ✅                                 |
| Label                  | ✅                                   | –                                  |
| Link                   | ❌                                   | ✅                                 |
| List                   | ✅                                   | –                                  |
| Loading                | ✅                                   | –                                  |
| Lottie                 | ❌                                   | ✅                                 |
| Map                    | ❌                                   | ✅                                 |
| PostItem               | ✅                                   | –                                  |
| PostTeaser             | ✅                                   | –                                  |
| PostWidget             | ✅                                   | –                                  |
| PostWidgetCarousel     | ❌                                   | ✅                                 |
| Quote                  | ✅                                   | –                                  |
| RichText               | ✅                                   | –                                  |
| Select                 | ❌                                   | ✅                                 |
| Skeleton               | ✅                                   | –                                  |
| Slider                 | ❌                                   | ✅                                 |
| Stepper                | ❌                                   | ✅                                 |
| Switch                 | ❌                                   | ✅                                 |
| Table                  | ✅                                   | –                                  |
| Teaser                 | ❌                                   | ✅                                 |

## 🎯 Next steps

- [ ] Make all components **RSC-compatible** and **client-optimized**
- [ ] Add more ✨ **fancy styling**, UI polish and properties
- [ ] Improve **accessibility** to meet **WCAG 2.2 AAA** standards
- [ ] Detailed Documentation about the components

## 📘 Documentation

> Notice: Currently are not all components in Storybook available

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