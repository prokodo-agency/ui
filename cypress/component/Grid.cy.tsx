import { Grid } from "../../src/components/grid"

describe("Grid", () => {
  it("renders children in a grid container", () => {
    cy.mount(
      <Grid>
        <div>Column 1</div>
        <div>Column 2</div>
      </Grid>,
    )
    cy.contains("Column 1").should("be.visible")
    cy.contains("Column 2").should("be.visible")
  })

  it("renders a div container", () => {
    cy.mount(
      <Grid>
        <span>Content</span>
      </Grid>,
    )
    cy.get("div").should("exist")
  })

  it("applies custom spacing via style", () => {
    cy.mount(
      <Grid spacing={4}>
        <div>Item</div>
      </Grid>,
    )
    // spacing=4 → gap: 32px
    cy.get("[style*='gap']").should("exist")
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <Grid>
        <p>Grid content</p>
      </Grid>,
    )
    cy.checkAccessibility()
  })
})
