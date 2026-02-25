import { ChipView } from "../../src/components/chip/Chip.view"

describe("Chip", () => {
  it("renders chip label", () => {
    cy.mount(<ChipView label="Technology" />)
    cy.contains("Technology").should("be.visible")
  })

  it("renders as filled variant by default", () => {
    cy.mount(<ChipView label="Design" />)
    cy.get("[class*='filled']").should("exist")
  })

  it("renders as outlined variant", () => {
    cy.mount(<ChipView label="Outlined" variant="outlined" />)
    cy.get("[class*='outlined']").should("exist")
  })

  it("calls onClick when clicked", () => {
    const onClick = cy.stub().as("onClick")
    cy.mount(<ChipView label="Clickable" onClick={onClick} />)
    cy.get("[role='button']").click()
    cy.get("@onClick").should("have.been.called")
  })

  it("renders delete button when onDelete is provided", () => {
    cy.mount(<ChipView label="Removable" onDelete={cy.stub()} />)
    cy.get("button").should("exist")
  })

  it("delete button has aria-label=delete", () => {
    cy.mount(<ChipView label="Tag" onDelete={cy.stub()} />)
    cy.get("[aria-label='delete']").should("exist")
  })

  it("clicking delete button fires onDelete", () => {
    const onDelete = cy.stub().as("onDelete")
    cy.mount(<ChipView label="Removable chip" onDelete={onDelete} />)
    cy.get("[aria-label='delete']").click()
    cy.get("@onDelete").should("have.been.called")
  })

  it("has no accessibility violations", () => {
    cy.mount(<ChipView label="Accessible chip" />)
    cy.checkAccessibility()
  })
})
