import { Tabs } from "../../src/components/tabs"

const tabItems = [
  { value: "t1", label: "Overview", content: <p>Overview panel</p> },
  { value: "t2", label: "Details", content: <p>Details panel</p> },
  { value: "t3", label: "Reviews", content: <p>Reviews panel</p> },
]

describe("Tabs", () => {
  it("renders all tab labels", () => {
    cy.mount(<Tabs id="tabs" ariaLabel="Product tabs" items={tabItems} />)
    cy.contains("Overview").should("be.visible")
    cy.contains("Details").should("be.visible")
    cy.contains("Reviews").should("be.visible")
  })

  it("shows first panel by default", () => {
    cy.mount(<Tabs id="tabs" items={tabItems} />)
    cy.contains("Overview panel").should("be.visible")
  })

  it("switches panel on tab click", () => {
    cy.mount(<Tabs id="tabs" items={tabItems} />)
    cy.contains("Details").click()
    cy.contains("Details panel").should("be.visible")
  })

  it("has correct ARIA roles", () => {
    cy.mount(<Tabs id="tabs" ariaLabel="Navigation tabs" items={tabItems} />)
    cy.get("[role='tablist']").should("exist")
    cy.get("[role='tab']").should("have.length", 3)
    cy.get("[role='tabpanel']").should("have.length", 3)
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <Tabs id="a11y-tabs" ariaLabel="Content sections" items={tabItems} />,
    )
    cy.checkAccessibility()
  })

  it("active tab has aria-selected=true", () => {
    cy.mount(<Tabs id="tabs" items={tabItems} />)
    cy.get("[role='tab']").first().should("have.attr", "aria-selected", "true")
  })

  it("non-active tabs have aria-selected=false", () => {
    cy.mount(<Tabs id="tabs" items={tabItems} />)
    cy.get("[role='tab']").eq(1).should("have.attr", "aria-selected", "false")
    cy.get("[role='tab']").eq(2).should("have.attr", "aria-selected", "false")
  })

  it("active tab has tabIndex=0, inactive have tabIndex=-1", () => {
    cy.mount(<Tabs id="tabs" items={tabItems} />)
    cy.get("[role='tab']").first().should("have.attr", "tabindex", "0")
    cy.get("[role='tab']").eq(1).should("have.attr", "tabindex", "-1")
  })

  it("ArrowRight navigates to next tab", () => {
    cy.mount(<Tabs id="tabs" ariaLabel="Navigation tabs" items={tabItems} />)
    cy.get("[role='tab']")
      .first()
      .focus()
      .trigger("keydown", { key: "ArrowRight", bubbles: true })
    cy.get("[role='tab']").eq(1).should("have.attr", "aria-selected", "true")
  })

  it("ArrowLeft navigates to previous tab", () => {
    cy.mount(<Tabs id="tabs" ariaLabel="Navigation tabs" items={tabItems} />)
    // switch to second tab first
    cy.contains("Details").click()
    cy.get("[role='tab']")
      .eq(1)
      .focus()
      .trigger("keydown", { key: "ArrowLeft", bubbles: true })
    cy.get("[role='tab']").first().should("have.attr", "aria-selected", "true")
  })
})
