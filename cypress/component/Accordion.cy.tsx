import { Accordion } from "../../src/components/accordion"

const items = [
  {
    id: "q1",
    title: "What is React?",
    renderContent: <p>A JavaScript library for building UIs.</p>,
  },
  {
    id: "q2",
    title: "What is TypeScript?",
    renderContent: <p>A typed superset of JavaScript.</p>,
  },
  {
    id: "q3",
    title: "What is Vite?",
    renderContent: <p>A fast frontend build tool.</p>,
  },
]

describe("Accordion", () => {
  it("renders all accordion items", () => {
    cy.mount(<Accordion id="faq" items={items} />)
    cy.contains("What is React?").should("be.visible")
    cy.contains("What is TypeScript?").should("be.visible")
  })

  it("initially hides panel content", () => {
    cy.mount(<Accordion id="faq" items={items} />)
    cy.contains("A JavaScript library for building UIs.").should(
      "not.be.visible",
    )
  })

  it("reveals content on click", () => {
    cy.mount(<Accordion id="faq" items={items} />)
    cy.contains("What is React?").click()
    cy.contains("A JavaScript library for building UIs.").should("be.visible")
  })

  it("has correct ARIA attributes on collapsed item", () => {
    cy.mount(<Accordion id="faq" items={items} />)
    cy.get("[aria-expanded]")
      .first()
      .should("have.attr", "aria-expanded", "false")
  })

  it("expanded item has aria-expanded=true", () => {
    cy.mount(<Accordion id="faq" items={items} />)
    cy.contains("What is React?").click()
    cy.get("[aria-expanded='true']").should("exist")
  })

  it("clicking an expanded item collapses it", () => {
    cy.mount(<Accordion id="faq" items={items} />)
    cy.contains("What is React?").click()
    cy.contains("A JavaScript library for building UIs.").should("be.visible")
    cy.contains("What is React?").click()
    cy.contains("A JavaScript library for building UIs.").should(
      "not.be.visible",
    )
  })

  it("Enter key expands a collapsed item", () => {
    cy.mount(<Accordion id="faq" items={items} />)
    cy.get("[aria-expanded='false']").first().focus().type("{enter}")
    cy.get("[aria-expanded='true']").should("exist")
  })

  it("Space key expands a collapsed item", () => {
    cy.mount(<Accordion id="faq" items={items} />)
    cy.get("[aria-expanded='false']").first().focus().type(" ")
    cy.get("[aria-expanded='true']").should("exist")
  })

  it("has no accessibility violations when collapsed", () => {
    cy.mount(<Accordion id="faq" items={items} />)
    cy.checkAccessibility()
  })

  it("has no accessibility violations when expanded", () => {
    cy.mount(<Accordion id="faq" items={items} />)
    cy.contains("What is React?").click()
    cy.checkAccessibility()
  })
})
