# Copilot Instructions (prokodo/ui)

## Goal

You are working in **prokodo’s React UI component library** that is:

- **Next.js compatible** (App Router / React Server Components friendly)
- built with **Vite**, **TypeScript**, **pnpm**
- styled with **SCSS Modules + BEM**
- using a **Progressive Enhancement “Island” pattern** (Server-first + optional Client hydration)

**Primary objective:** build small, reusable UI components that render on the server by default and only hydrate on the client when necessary.

---

## Non-negotiables (HARD RULES)

- Follow existing patterns in this repository. Prefer reusing existing helpers and structures over inventing new ones.
- Do NOT introduce new conventions unless explicitly requested.
- Do NOT add new dependencies unless explicitly requested.
- Do NOT introduce breaking changes unless explicitly requested.
- Never log secrets/tokens/PII.
- Keep code small, readable, and predictable. Prefer straightforward solutions over clever ones.

---

## Stack & Compatibility (MANDATORY)

- React + TypeScript, **Vite**, **pnpm**
- Must remain **Next.js compatible**:
  - Avoid Next-only imports inside the library (e.g. `next/*`) unless the repo already does.
  - Components must be safe to render in RSC environments.
  - Server files must not access browser APIs.

### Styling

- **SCSS Modules + BEM helper**
- Do not change existing BEM naming patterns.

### Prefer existing internal helpers (reuse-first)

- `@/helpers/createIsland`
- `@/helpers/createLazyWrapper`
- `@/helpers/bem`
- `@/helpers/validations`

---

## Component Architecture: Island Pattern (STRICT)

All interactive components follow this structure (example: `Input`):

- `index.ts` → public exports only (component + types)
- `<Component>.tsx` → island entry that wires Server + Lazy
- `<Component>.server.tsx` → server version (no hooks, no browser APIs)
- `<Component>.client.tsx` → client version (hooks/events)
- `<Component>.lazy.tsx` → lazy wrapper connecting client+server
- `<Component>.view.tsx` → pure presentational view (no state)
- `<Component>.model.ts` → exported props + types (no runtime logic)
- `<Component>.module.scss` → SCSS module with BEM block
- `<Component>.stories.tsx` → Storybook
- `files.test.tsx` → unit tests for the component folder (see testing section)

### Rules

- **Default: render on the server** (`*.server.tsx`) and keep it safe/lean.
- Only create `*.client.tsx` if the component **needs**:
  - local state, effects, DOM events, measurements, browser APIs, refs with effects
- `*.view.tsx` must be **pure** and reusable by both Server and Client.
- Do NOT put business logic into `.view.tsx`.
- Do NOT access `window`, `document`, `localStorage` in server files.
- Keep island wiring consistent:
  - `<Component>.tsx` must call `createIsland({ name, Server, loadLazy })`
  - `<Component>.lazy.tsx` must call `createLazyWrapper({ name, Client, Server })`

---

## TypeScript ESLint: strict-boolean-expressions (MANDATORY)

This repo enforces `@typescript-eslint/strict-boolean-expressions`.

So **DO NOT** use implicit truthy/falsy checks on nullable/unknown values.
Always handle nullish/empty cases explicitly.

### Required helper usage (STRICT)

When branching on values that may be `unknown | null | undefined`, you MUST use shared validation helpers:

- Import from: `@/helpers/validations`
  - `isString`, `isNumber`, `isArray`, `isNull`, `isTrue`, `isEqual`

Examples you MUST follow:

- Strings:
  - ✅ `if (isString(value)) { ... }`
  - ❌ `if (value) { ... }`
- Numbers:
  - ✅ `if (isNumber(n)) { ... }`
  - ❌ `if (n) { ... }`
- Arrays:
  - ✅ `if (isArray(arr)) { ... }`
  - ❌ `if (arr?.length) { ... }`
- Nullable checks:
  - ✅ `if (isNull(x)) { ... }`
  - ❌ `if (!x) { ... }` (when x is unknown / object / union)
- Booleans:
  - ✅ `if (isTrue(flag)) { ... }` or `if (flag === true) { ... }`
  - ❌ `if (flag) { ... }` (if flag is `boolean | undefined`)

---

## Public API & Entrypoints (STRICT)

### 1) Public component overview lives in `components/index.ts`

This repo exposes the **public component surface** via a single overview file:

- `components/index.ts`

It lists/exports all components like:

- `export { Input } from "./components/input"`
- `export { Button } from "./components/button"`

**Rules**

- When adding a new component, you MUST add it to `components/index.ts`.
- Keep exports **alphabetically sorted** (or follow the existing ordering exactly if it is already non-alpha).
- Do NOT add deep exports from internal files (no `./components/x/X.view` etc.).
- Do NOT export internal-only building blocks unless explicitly requested.

### 2) Component-local entrypoint stays in each component folder

Each component folder must keep its own public entry:

- `components/<name>/index.ts`

This file should export:

- the island component (from `./<Component>`)
- its public types (from `./<Component>.model`)

Example:

- `export * from "./Input"`
- `export type { InputProps, ... } from "./Input.model"`

### 3) Helpers exports are separate and explicit

Helpers intended for consumers must be exported under a dedicated section in `components/index.ts`:

```ts
// HELPERS
export { UIRuntimeProvider, useUIRuntime } from "./helpers/runtime.client"
```

### Rules

- Only export helpers that are intended for consumers.
- Keep helper exports grouped under `// HELPERS`.
- Do NOT mix helpers into component exports.

---

## Styling: SCSS Modules + BEM (STRICT)

- Use `create(styles, "BlockName")` and `bem(...)` exactly like existing components.
- SCSS must define the block with the repo mixin:

```scss
@include define-block("BlockName") { ... }
```

### BEM rules

- Elements: `&__element`
- Modifiers: `&--modifier` or via `bem("element", { modifier: true })`
- Do NOT rename BEM blocks/elements in existing files.
- Prefer repo mixins/utilities (screens, spaces, gradients, accessibility).

---

## Props & Types (STRICT)

- `*.model.ts` is the single source of truth for public types.
- Props must be:
  - explicit (avoid `any`)
  - compatible with SSR/RSC
  - stable and minimal (avoid huge unions unless needed)
- When extending DOM attributes:
  - use `Omit<...>` to remove conflicting fields (as in `Input.model.ts`)
- Do NOT put runtime code in `*.model.ts`.

---

## Accessibility Best Practices (A11Y) — WCAG 2.2 oriented (MANDATORY)

All components must be accessible by default. Treat this section as a baseline aligned with WCAG 2.2 (AA).

### General rules

- Prefer native elements (`button`, `a`, `input`, `select`, `textarea`) over div-based controls.
- If a non-native element behaves like a control, it MUST implement:
  - correct `role`
  - keyboard interaction (Enter/Space where applicable)
  - focus states
  - accessible name (`label`/`aria-label`/`aria-labelledby`)
  - state/value via ARIA when applicable (e.g. `aria-checked`, `aria-expanded`)

### Labels & names

- All form controls must have an accessible name:
  - `<label htmlFor="id">` preferred
  - or `aria-label` / `aria-labelledby` if no visible label exists
- Do NOT rely on placeholder as the only label.

### ARIA (use only when needed)

- Use ARIA to express state, not styling:
  - `aria-disabled`, `aria-expanded`, `aria-selected`, `aria-checked`
- Error/Help text:
  - connect via `aria-describedby`
  - errors should use `role="alert"` and/or `aria-live="assertive"` when appropriate
- Status updates (toasts, loaders, async validation) MUST be announced appropriately:
  - prefer `role="status"` / `aria-live="polite"` for non-blocking updates
  - prefer `role="alert"` / `aria-live="assertive"` for critical errors

### Keyboard (WCAG 2.1.1 / 2.1.2)

- All interactive elements must be reachable via Tab.
- Don’t trap focus unless it’s a modal/dialog (and then manage focus properly).
- Ensure Escape closes dismissible overlays (Dialog/Drawer/Tooltip/Drawer if applicable).
- No keyboard “dead ends”: user must be able to leave any component using standard navigation.

### Focus appearance (WCAG 2.4.7 + 2.4.11/2.4.12)

- A visible focus indicator is required for all interactive controls.
- Do NOT remove outlines unless replaced with an accessible focus style.
- Focus indicator must be clearly distinguishable from the unfocused state
  (size/contrast sufficient; do not rely on subtle color shifts only).
- Focus order must follow visual/layout logic; do not reorder focus via tabindex hacks unless necessary.

### Pointer & touch (WCAG 2.5.1 / 2.5.2 / 2.5.8)

- No multi-pointer or path-based gestures ONLY (e.g. pinch/drag-only). Provide a simple alternative (buttons/keyboard).
- Pointer cancellation: avoid “down-event” irreversible actions; actions should trigger on click/up or provide undo/cancel where appropriate.
- Target size: interactive targets must be large enough for touch usage.
  - Prefer >= 44×44 CSS px (best practice).
  - Minimum: ensure at least ~24×24 CSS px or provide sufficient spacing/offset target.
  - Icon-only buttons must meet the same target-size requirement.

### Dragging movements (WCAG 2.5.7)

- If a feature supports drag (slider, sortable list, carousel drag),
  it MUST also support non-drag operation:
  - keyboard interaction and/or explicit buttons/controls.

### Images & icons

- `img` must have meaningful `alt` or empty `alt=""` if decorative.
- Icon-only buttons/links must have `aria-label` (or `aria-labelledby`).

### Color & contrast (WCAG 1.4.x)

- Do not rely on color alone to convey meaning (errors, selected state, required).
- Ensure text/icons in interactive controls meet contrast requirements in both themes.
- Provide non-color cues for error/required/selected states (text, icon, underline, etc.).

### Reduced motion (WCAG 2.3.3)

- If a component animates, respect user preferences:
  - use `prefers-reduced-motion` in CSS where relevant
  - avoid essential meaning only conveyed by motion
  - avoid large/rapid animations that could be distracting

### Forms & errors (WCAG 3.3.x)

- Errors must be clearly identified and associated with the field (`aria-describedby`).
- Provide helpful error messages (what + how to fix) and keep them deterministic.
- Do not implement “accessible authentication” blockers (e.g. no puzzle-only / memory-only steps);
  if auth-related UI exists, allow password managers and copy/paste.

---

## Performance & “Less Code” Rules (MANDATORY)

### Render strategy

- Server-first: render usable HTML on the server.
- Hydrate only where necessary. No client component “just in case”.
- Keep `.client.tsx` small:
  - local state and handlers only
  - do not duplicate markup; push markup into `.view.tsx`

### React patterns

- Prefer `useCallback`/`useMemo` only when it prevents real rerenders or heavy computation.
- Do NOT memoize everything by default.
- Prefer `memo()` only for components that:
  - re-render frequently AND
  - receive stable props AND
  - are performance-sensitive
- Avoid creating new objects/functions in render for props passed deep down unless it’s causing measurable rerenders.

### Avoid expensive work

- No layout thrashing (DOM measurement loops).
- Avoid expensive regex patterns; no catastrophic backtracking.
- Keep bundles small: do NOT add dependencies.

---

## Utilities files (`*.utils.ts`)

Sometimes components include helper files like `*.utils.ts`.

### Rules

- Utilities must be small, focused, and reusable inside the component/domain.
- Do NOT create “god utils” files.
- Do NOT move component logic from `*.client.tsx` into utils just to “reduce hooks usage”.
- If a util is broadly reused across many components, prefer moving it into `@/helpers/**`
  (only if it matches existing helper patterns and naming).

---

## Unit Testing (MANDATORY) — `files.test.tsx`

All non-trivial components must be unit tested under the component folder:

- `components/<name>/files.test.tsx`

### What to test (minimum)

- Renders without crashing (server-safe view where applicable)
- Accessible name exists (labels / aria-label)
- Keyboard interaction (Enter/Space/Escape) when relevant
- ARIA state correctness (`aria-expanded`, `aria-invalid`, `aria-describedby`, etc.)
- Event handlers fire correctly:
  - `onChange`, `onClick`, `onValidate`, etc.
- Edge cases:
  - disabled/readOnly behavior
  - error state rendering
  - required field behavior (if implemented)

### Testing rules

- Prefer testing the View (`*.view.tsx`) for pure rendering and a11y behavior.
- Test Client wrapper (`*.client.tsx`) only for:
  - state transitions
  - event handling
  - progressive enhancement specifics
- Keep tests small and deterministic. No timers unless required.
- Do NOT snapshot huge DOM trees; prefer explicit assertions.
- If an interaction is implemented, it must be covered by a test.

### Accessibility in tests

- Use queries that reflect accessibility:
  - prefer `getByRole`, `getByLabelText`, `getByText`
- Assert ARIA attributes and `aria-describedby` wiring where relevant.

---

## Storybook (When adding/changing components)

- Add/update `*.stories.tsx`:
  - Provide at least:
    - Default
    - Disabled (if supported)
    - Error/Validation state (if relevant)
    - Variants (multiline, sizes, etc.)
- Keep SB args realistic and UX-focused.
- Disable non-UX-relevant props in `argTypes` like the Input example.

---

## Output expectations for Copilot

When implementing a new component or changing an existing one:

- Follow the island folder pattern.
- Update exports in:
  - `components/<name>/index.ts`
  - `components/index.ts`
- Ensure SCSS uses the correct BEM block and mixins.
- Add/adjust Storybook stories.
- Add/adjust unit tests in `components/<name>/files.test.tsx`.
- Keep server rendering correct; only hydrate when necessary.
- No implicit boolean checks on nullable/unknown values.

---

## Typical component checklist (copy/paste)

- [ ] `components/<name>/index.ts` exports component + types
- [ ] `components/<name>/<Component>.tsx` uses `createIsland`
- [ ] `components/<name>/<Component>.server.tsx` renders `<Component>View` (server-safe)
- [ ] `components/<name>/<Component>.client.tsx` contains hooks/events only if needed
- [ ] `components/<name>/<Component>.lazy.tsx` uses `createLazyWrapper`
- [ ] `components/<name>/<Component>.view.tsx` is pure + accessible
- [ ] `components/<name>/<Component>.model.ts` defines public props/types
- [ ] `components/<name>/<Component>.module.scss` defines BEM block with `define-block`
- [ ] `components/<name>/<Component>.stories.tsx` updated
- [ ] `components/<name>/files.test.tsx` added/updated
- [ ] `components/index.ts` updated (public surface)
- [ ] No implicit boolean checks on nullable/unknown values

---

## Commands

After non-trivial changes, run:

- `pnpm lint`
- `pnpm test`
- `pnpm build`
