<p align="center">
  <img src="https://cdn.prokodo.com/prokodo_logo_1a3bb7867c/prokodo_logo_1a3bb7867c.webp" alt="prokodo logo" height="80" />
</p>
<h1 align="center">prokodo UI (Beta)</h1>
<h2 align="center">Empowering Digital Innovation</h2>

**Modern, customizable UI components built with React and TypeScript — developed by [prokodo](https://www.prokodo.com) for high-performance web interfaces.**

[![npm](https://img.shields.io/npm/v/@prokodo/ui?style=flat&color=3178c6&label=npm)](https://www.npmjs.com/package/@prokodo/ui)
[![CI](https://github.com/prokodo-agency/ui/actions/workflows/release.yml/badge.svg)](https://github.com/prokodo-agency/ui/actions/workflows/release.yml)
[![License: BUSL-1.1](https://img.shields.io/badge/license-BUSL--1.1-blue.svg)](LICENSE)
[![Storybook](https://img.shields.io/badge/storybook-ui.prokodo.com-ff4785?logo=storybook&logoColor=white)](https://ui.prokodo.com)

---

## ✨ Features

- ⚡️ **Modern stack**: Vite, React 19, TypeScript, and SCSS Modules
- 💅 **Design consistency**: Theming via design tokens and BEM-style naming
- 🧩 **Component-rich**: 35+ reusable UI components
- 🧪 **Reliable**: Fully tested with Jest and Testing Library
- 📚 **Storybook**: Explore the components at [ui.prokodo.com](https://ui.prokodo.com)
- 📦 **DReady-to-install**: Distributed via npm for non-production use under the BUSL-1.1 license
- 🧱 **Optimized for SSR**: Works great with Next.js and React Server Components

---

## 🚀 Getting Started

### 1. Install the package

```bash
pnpm add @prokodo/ui
# or
npm install @prokodo/ui
```

### 2. Use a component

```tsx
import { Button, Accordion, Form } from '@prokodo/ui'
import type { ButtonProps, AccordionProps, FormProps } from '@prokodo/ui'

export default function Example() {
  return <Button>Click me</Button>
}
```

## 📦 Available Components
- Accordion
- Animated
- AnimatedText
- Avatar
- BaseLink
- Button
- Calendly
- Card
- Carousel
- Chip
- DatePicker
- Dialog
- Drawer
- Form
- FormResponse
- Grid
- GridRow
- Headline
- Icon
- Image
- ImageText
- Input
- InputOTP
- Label
- Link
- List
- Loading
- Lottie
- Map
- PostItem
- PostTeaser
- PostWidget
- PostWidgetCarousel
- Quote
- RichText
- Select
- Skeleton
- Slider
- Stepper
- Switch
- Table
- Teaser

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