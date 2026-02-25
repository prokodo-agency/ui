// Import Cypress Testing Library commands
import "@testing-library/cypress/add-commands"
// Import cypress-axe for WCAG 2.2 accessibility assertions
import "cypress-axe"
// Import Chromatic support – registers beforeEach/afterEach DOM snapshot capturing
import "@chromatic-com/cypress/support"
// Import global theme (design tokens / CSS custom properties) – mirrors .storybook/preview.tsx
import "../../src/styles/theme.scss"
// Import commands
import "./commands"

// Apply the theme supplied via --env theme=<light|dark> (defaults to light).
// The CI workflow runs the suite twice – once per theme – then merges the
// content-hashed archives before uploading to Chromatic, giving dual-mode
// visual-regression coverage without needing native Chromatic mode support.
const chromaticTheme = (Cypress.env("theme") as string) || "light"
document.documentElement.setAttribute("data-theme", chromaticTheme)

import { mount } from "cypress/react"

// Augment the Cypress namespace to include mount
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

Cypress.Commands.add("mount", mount)
