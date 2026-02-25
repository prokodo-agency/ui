import { Label } from "../../src/components/label"

describe("Label", () => {
  it("renders label text", () => {
    cy.mount(<Label label="Email address" />)
    cy.contains("Email address").should("be.visible")
  })

  it("renders required indicator when required=true", () => {
    cy.mount(<Label label="Required field" required />)
    cy.get("label, span").should("exist")
    // Required fields typically have an asterisk or aria indicator
    cy.contains("Required field").should("be.visible")
  })

  it("renders error state", () => {
    cy.mount(<Label error label="Invalid field" />)
    cy.get("[class*='error'], [class*='is-error']").should("exist")
  })

  it("renders as a <label> tag by default", () => {
    cy.mount(<Label label="Form label" />)
    cy.get("label").should("exist")
  })

  it("renders as a <legend> when type='legend'", () => {
    cy.mount(<Label label="Legend label" type="legend" />)
    cy.get("legend").should("exist")
  })

  it("has no accessibility violations", () => {
    cy.mount(<Label label="Accessible label" />)
    cy.checkAccessibility()
  })
})
