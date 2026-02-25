import { BaseLinkView } from "../../src/components/base-link/BaseLink.view"

describe("BaseLink", () => {
  it("renders link text", () => {
    cy.mount(<BaseLinkView href="/page">Visit page</BaseLinkView>)
    cy.contains("Visit page").should("be.visible")
  })

  it("renders with correct href", () => {
    cy.mount(<BaseLinkView href="/services">Services</BaseLinkView>)
    cy.get("a").should("have.attr", "href", "/services")
  })

  it("renders email link with mailto: href", () => {
    cy.mount(<BaseLinkView href="info@example.com">Email us</BaseLinkView>)
    cy.get("a").should("have.attr", "href").and("contain", "mailto:")
  })

  it("renders as disabled", () => {
    cy.mount(
      <BaseLinkView disabled href="/page">
        Disabled
      </BaseLinkView>,
    )
    cy.get("[aria-disabled='true']").should("exist")
  })

  it("has no accessibility violations", () => {
    cy.mount(<BaseLinkView href="/about">About</BaseLinkView>)
    cy.checkAccessibility()
  })

  it("absolute URL gets rel=noopener noreferrer", () => {
    cy.mount(<BaseLinkView href="https://example.com">External</BaseLinkView>)
    cy.get("a").should("have.attr", "rel", "noopener noreferrer")
  })

  it("relative URL does not get rel attribute", () => {
    cy.mount(<BaseLinkView href="/page">Internal</BaseLinkView>)
    cy.get("a").should("not.have.attr", "rel")
  })

  it("absolute URL opens in a new tab by default", () => {
    cy.mount(<BaseLinkView href="https://example.com">External</BaseLinkView>)
    cy.get("a").should("have.attr", "target", "_blank")
  })

  it("external link has no accessibility violations", () => {
    cy.mount(
      <BaseLinkView href="https://example.com">External link</BaseLinkView>,
    )
    cy.checkAccessibility()
  })
})
