import { TooltipView } from "../../src/components/tooltip/Tooltip.view"

describe("Tooltip", () => {
  it("renders trigger element", () => {
    cy.mount(
      <TooltipView content="Helpful information">
        <button type="button">Hover me</button>
      </TooltipView>,
    )
    cy.contains("Hover me").should("be.visible")
  })

  it("renders tooltip content", () => {
    cy.mount(
      <TooltipView content="Tooltip text">
        <button type="button">Trigger</button>
      </TooltipView>,
    )
    cy.contains("Tooltip text").should("exist")
  })

  it("associates tooltip with trigger via aria-describedby", () => {
    cy.mount(
      <TooltipView content="Description here">
        <button type="button">Info button</button>
      </TooltipView>,
    )
    cy.get("button").should("have.attr", "aria-describedby")
  })

  it("renders in disabled mode without aria-describedby", () => {
    cy.mount(
      <TooltipView disabled content="Hidden content">
        <button type="button">No tooltip</button>
      </TooltipView>,
    )
    cy.get("button").should("not.have.attr", "aria-describedby")
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <TooltipView content="Accessible tooltip">
        <button type="button">Focus me</button>
      </TooltipView>,
    )
    cy.checkAccessibility()
  })
})
