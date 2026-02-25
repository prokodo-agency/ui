import { Quote } from "../../src/components/quote"

describe("Quote", () => {
  it("renders quote content", () => {
    cy.mount(
      <Quote content="The best way to predict the future is to create it." />,
    )
    cy.contains("The best way to predict").should("be.visible")
  })

  it("renders with a title", () => {
    cy.mount(
      <Quote
        content="Innovation distinguishes between a leader and a follower."
        title={{ content: "On Leadership" }}
      />,
    )
    cy.contains("On Leadership").should("be.visible")
  })

  it("renders with an author", () => {
    cy.mount(
      <Quote
        author={{ name: "Steve Jobs" }}
        content="Stay hungry, stay foolish."
      />,
    )
    cy.contains("Steve Jobs").should("be.visible")
  })

  it("renders as a figure element", () => {
    cy.mount(<Quote content="Quote text" />)
    cy.get("figure").should("exist")
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <Quote
        author={{ name: "Albert Einstein" }}
        content="Imagination is more important than knowledge."
      />,
    )
    cy.checkAccessibility()
  })
})
