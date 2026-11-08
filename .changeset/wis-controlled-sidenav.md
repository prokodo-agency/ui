---
"@prokodo/ui": minor
---

Add optional `collapsed` and `onCollapsedChange` props to `SideNav` so application shells can own the collapse state. Controlled mode takes precedence over `initialCollapsed` and leaves persistence to the parent. Existing uncontrolled consumers retain their saved preference and remain usable when browser storage is unavailable.

Document both modes, callback semantics, SSR and mobile overlay responsibilities in the English/German guides and Storybook, with an interactive controlled example. No migration is required for existing uncontrolled usage.
