# @prokodo/ui

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
