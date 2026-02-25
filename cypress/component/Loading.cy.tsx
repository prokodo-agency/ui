import { SpinnerView } from "../../src/components/loading/Loading.view"

describe("Loading / Spinner", () => {
  it("renders a spinner", () => {
    cy.mount(<SpinnerView />)
    cy.get("[role='status']").should("exist")
  })

  it("renders with default aria-label", () => {
    cy.mount(<SpinnerView />)
    cy.get("[aria-label='Loading']").should("exist")
  })

  it("renders with custom aria-label", () => {
    cy.mount(<SpinnerView ariaLabel="Saving..." />)
    cy.get("[aria-label='Saving...']").should("exist")
  })

  it("renders as an SVG element", () => {
    cy.mount(<SpinnerView />)
    cy.get("svg").should("exist")
  })

  it("renders with custom size", () => {
    cy.mount(<SpinnerView size="lg" />)
    cy.get("svg").should("have.attr", "width", "48")
  })

  it("has no accessibility violations", () => {
    cy.mount(<SpinnerView ariaLabel="Loading content" />)
    cy.checkAccessibility()
  })
})
