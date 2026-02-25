import { AnimatedTextView } from "../../src/components/animatedText/AnimatedText.view"

describe("AnimatedText", () => {
  it("renders the text content", () => {
    cy.mount(<AnimatedTextView text="Hello World" />)
    cy.contains("Hello World").should("be.visible")
  })

  it("renders as a span element", () => {
    cy.mount(<AnimatedTextView text="Span text" />)
    cy.get("span").should("contain", "Span text")
  })

  it("passes additional props to the span", () => {
    cy.mount(
      <AnimatedTextView
        aria-label="Animated label"
        data-testid="anim-text"
        text="Labeled text"
      />,
    )
    cy.get("[data-testid='anim-text']").should("have.attr", "aria-label")
  })

  it("has no accessibility violations", () => {
    cy.mount(<AnimatedTextView text="Accessible animated text" />)
    cy.checkAccessibility()
  })
})
