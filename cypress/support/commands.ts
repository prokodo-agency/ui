/**
 * Custom Cypress commands for prokodo-ui component testing.
 *
 * Adds reusable a11y helpers on top of cypress-axe's
 * cy.injectAxe() / cy.checkA11y() primitives.
 */

export {}

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Inject axe-core and run a WCAG 2.2 AA accessibility audit.
       * @param subject  Optional selector / element to scope the audit
       * @param options  cypress-axe checkA11y options override
       */
      checkAccessibility(
        subject?: string | Element | null,
        options?: Parameters<typeof cy.checkA11y>[1],
      ): Chainable<void>
    }
  }
}

/**
 * Mount a component, inject axe, and run a full WCAG 2.2 AA audit.
 * Logs all violations to the terminal via cy.task so they appear in headless output.
 * Rules disabled globally for component tests:
 *   - color-contrast: CSS custom properties are not computed in test environment
 *   - region: isolated components are not full pages with landmark regions
 * Usage:
 *   cy.mount(<Button title="Click me" />)
 *   cy.checkAccessibility()
 */
Cypress.Commands.add(
  "checkAccessibility",
  (
    subject?: string | Element | null,
    options?: Parameters<typeof cy.checkA11y>[1],
  ) => {
    cy.injectAxe()
    cy.checkA11y(
      subject ?? undefined,
      {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
        },
        rules: {
          // CSS custom properties are not computed in Cypress test environment
          "color-contrast": { enabled: false },
          // Isolated components are not full pages with landmark regions
          region: { enabled: false },
          // Cypress test runner creates many scrollable regions in its own iframe
          // that are outside the component under test — not a real violation
          "scrollable-region-focusable": { enabled: false },
        },
        ...options,
      },
      violations => {
        cy.task("logViolations", violations)
      },
    )
  },
)
