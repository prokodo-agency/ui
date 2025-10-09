# @prokodo/ui

## 0.0.55

### Patch Changes

- Style fix in form elements

## 0.0.54

### Patch Changes

- feat: Added highlight.js to style code in RichText component and fixed some bugs in blog components

## 0.0.53

### Patch Changes

- Beta release of blog components

## 0.0.52

### Patch Changes

- hotfix: Drawer component

## 0.0.51

### Patch Changes

- hotfix: RichText component styles

## 0.0.50

### Patch Changes

- Multiple bug fixes and peformance updates

## 0.0.49

### Patch Changes

- Bugfix README

## 0.0.48

### Patch Changes

- Changed README and package.json

## 0.0.47

### Patch Changes

- Time support for datepicker component

## 0.0.46

### Patch Changes

- Fixed multiple small bugs in Form and Input, changed eslint config, changed styling of accordion and list component

## 0.0.45

### Patch Changes

- Bugfix link and base link component

## 0.0.44

### Patch Changes

- Select field support in Dynamic List component

## 0.0.42

### Patch Changes

- New Progress bar, Dynamic list and Snackbar components with included Snackbar Provider

## 0.0.41

### Patch Changes

- Fixed README

## 0.0.40

### Patch Changes

- Updated README

## 0.0.39

### Patch Changes

#### ♻️ Refactor: Automated Island Component (AIC) Pattern

Refactored `Button`, `Link`, `Animated`, and `Accordion` components to adopt the new **Automated Island Component (AIC)** architecture.

#### ✅ Benefits for Consumers

- **Unified Import**  
  All components can now be imported via:
  ```ts
  import { Button } from "@prokodo/ui"
  ```
- **Optimized Rendering**
  ⚡ Server-first rendering when no interactivity is needed
  🧠 On-demand hydration only for interactive islands
  👀 IntersectionObserver-based gating to defer client JS until in-view
  ⏩ Optional priority prop to force eager hydration (for above-the-fold content)
  🧹 Zero-config tree-shaking: unused islands are excluded from the bundle

- 🔧 Technical Changes
- 🧩 Core Helpers
- helpers/createIsland.tsx
  Entry component factory to auto-detect interactivity and select server/client rendering

- helpers/createLazyWrapper.tsx
  Client-side wrapper to defer hydration using IntersectionObserver + priority flags

- hooks/useHydrationReady
  Extended to accept custom IntersectionObserver options

- 📦 Component Structure
  Each refactored component now includes:
  - \*.server.tsx
    Pure server-side rendering (no React hooks)
  - \*.client.tsx
    Fully interactive client logic
  - \*.lazy.tsx
    Lazy-loaded wrapper using IntersectionObserver

index.tsx
Wires everything together using createIsland or createLazyWrapper

## 0.0.38

### Patch Changes

- fix: Bugfix in AIC logic and Link component

## 0.0.37

### Patch Changes

- feat: Converted Link component in AIC

## 0.0.36

### Patch Changes

- chore: Optimization of code structure for AIC

## 0.0.35

### Patch Changes

- fix: Bugfix AIC Button component

## 0.0.34

### Patch Changes

- fix: Splitted AIC Button component in single view

## 0.0.33

### Patch Changes

- fix: Change AIC Button component logic

## 0.0.32

### Patch Changes

- fix: Optimization for experimental AIC Button

## 0.0.31

### Patch Changes

- fix: AIC Button component type fix

## 0.0.30

### Patch Changes

- fix: Added priority option to AIC Button component

## 0.0.29

### Patch Changes

- fix: Small optimization for experimental AIC

## 0.0.28

### Patch Changes

- fix: AIC Button fix

## 0.0.27

### Patch Changes

- Adaptive-Island Component infrastructure (experimental)

## 0.0.26

### Patch Changes

- fix: Changed build config for RSC compatibility (test only)

## 0.0.25

### Patch Changes

- Possibility to export PostItemAuthor component

## 0.0.24

### Patch Changes

- fix: RSC ready Grid & GridRow

## 0.0.23

### Patch Changes

- fix: Typescript config bug

## 0.0.22

### Patch Changes

- Refactored the Icon component to improve compatibility and performance in server-rendered environments.

## 0.0.21

### Patch Changes

- fix: Converted icon component in client component

## 0.0.20

### Patch Changes

- fix: Bugfix icon component

## 0.0.19

### Patch Changes

- fix: Hotfix Icon component file path

## 0.0.18

### Patch Changes

- fix: Dynamic version for CDN based icons of Icon component

## 0.0.17

### Patch Changes

- fix: consistent casing for Icon-list import

## 0.0.16

### Patch Changes

- Migrate all icons to use a CDN-based loading approach. Improves performance and enables SSR compatibility. Also implements AAA-level accessibility.

## 0.0.15

### Patch Changes

- Refactored icon handling for optimal performance, memory usage, and flexibility in consuming applications (e.g., Next.js). This enables dynamic icon loading without triggering excessive module preloading or memory leaks during build.

## 0.0.14

### Patch Changes

- Optimize dynamic icon loading and improve tree-shaking performanc

## 0.0.13

### Patch Changes

- Avoid bundling all icon files directly into the npm package. This reduces install size and improves tree-shaking for consumers.

## 0.0.12

### Patch Changes

- Improved the Icon component by introducing dynamic loading via `getIconLoader`. This enables better tree-shaking and significantly reduces bundle size by avoiding eager loading of the entire icon set. Supports both Vite (using `import.meta.glob`) and fallback environments like Jest or Storybook using `import()`. Also improves compatibility with SSR and CI environments.

## 0.0.11

### Patch Changes

- Removed CJS support

## 0.0.10

### Patch Changes

- Bugfix build config

## 0.0.11

### Patch Changes

- Bugfix build config

## 0.0.10

### Patch Changes

- Bugfix build config

## 0.0.9

### Patch Changes

- Changed type structure

## 0.0.8

### Patch Changes

- Changed type structure

<<<<<<< HEAD

## 0.0.7

### Patch Changes

- Added theme.css to export list

## 0.0.8

### Patch Changes

- Added theme.css to export list

## 0.0.7

### Patch Changes

- Added theme.css to export files

=======

> > > > > > > eaa5a3fb9c588b005cb1cba62d9ce68eec3c6963

## 0.0.6

### Patch Changes

- f7f8cfb: Splitted component library in single exports
  <<<<<<< HEAD
- # fix: Exporting theme.css
  > > > > > > > eaa5a3fb9c588b005cb1cba62d9ce68eec3c6963

## 0.0.5

### Patch Changes

- e6d436b: Added changelogs and fixed open bugs.
