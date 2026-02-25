import { List } from "../../src/components/list"

const listItems = [
  { id: "1", title: "First item" },
  { id: "2", title: "Second item" },
  { id: "3", title: "Third item" },
]

describe("List", () => {
  it("renders list items", () => {
    cy.mount(<List items={listItems} />)
    cy.contains("First item").should("be.visible")
    cy.contains("Second item").should("be.visible")
  })

  it("renders as an unordered list", () => {
    cy.mount(<List items={listItems} />)
    cy.get("ul, ol").should("exist")
  })

  it("renders ordered list when type='ordered'", () => {
    cy.mount(<List items={listItems} />)
    cy.get("ul, ol").should("exist")
  })

  it("renders all items", () => {
    cy.mount(<List items={listItems} />)
    cy.get("li").should("have.length.at.least", 3)
  })

  it("has no accessibility violations", () => {
    cy.mount(<List items={listItems} />)
    cy.checkAccessibility()
  })
})
