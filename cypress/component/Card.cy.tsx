import { CardView } from "../../src/components/card/Card.view"

describe("Card", () => {
  it("renders children content", () => {
    cy.mount(
      <CardView>
        <p>Card content here</p>
      </CardView>,
    )
    cy.contains("Card content here").should("be.visible")
  })

  it("renders as a clickable card", () => {
    cy.mount(
      <CardView isClickable onClick={cy.stub().as("onClick")}>
        <p>Click me</p>
      </CardView>,
    )
    cy.get("[class*='is-clickable']").click({ force: true })
    cy.get("@onClick").should("have.been.called")
  })

  it("renders with a redirect link", () => {
    cy.mount(
      <CardView redirect={{ href: "/details" }}>
        <p>Linked card</p>
      </CardView>,
    )
    cy.get("a").should("have.attr", "href", "/details")
  })

  it("renders in loading state with skeleton", () => {
    cy.mount(
      <CardView loading>
        <p>Loading content</p>
      </CardView>,
    )
    cy.get("[class*='Skeleton']").should("exist")
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <CardView>
        <p>Accessible card</p>
      </CardView>,
    )
    cy.checkAccessibility()
  })
})
