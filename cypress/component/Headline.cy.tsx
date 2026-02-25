import { Headline } from "../../src/components/headline"

describe("Headline", () => {
  it("renders headline text", () => {
    cy.mount(<Headline>Welcome to our platform</Headline>)
    cy.contains("Welcome to our platform").should("be.visible")
  })

  it("renders as h1 when type='h1'", () => {
    cy.mount(<Headline type="h1">Main Title</Headline>)
    cy.get("h1").should("contain", "Main Title")
  })

  it("renders as h2 when type='h2'", () => {
    cy.mount(<Headline type="h2">Section Title</Headline>)
    cy.get("h2").should("contain", "Section Title")
  })

  it("renders default as h3", () => {
    cy.mount(<Headline>Default Headline</Headline>)
    cy.get("h3").should("contain", "Default Headline")
  })

  it("has no accessibility violations", () => {
    cy.mount(<Headline type="h2">Accessible Headline</Headline>)
    cy.checkAccessibility()
  })
})
