import { Skeleton } from "../../src/components/skeleton"

describe("Skeleton", () => {
  it("renders a skeleton placeholder", () => {
    cy.mount(<Skeleton />)
    cy.get("[class*='Skeleton']").should("exist")
  })

  it("renders with custom width and height", () => {
    cy.mount(<Skeleton height="50px" width="200px" />)
    cy.get("[style*='width: 200px']").should("exist")
  })

  it("renders as circular variant", () => {
    cy.mount(<Skeleton height="48px" variant="circular" width="48px" />)
    cy.get("[class*='circular']").should("exist")
  })

  it("renders with wave animation by default", () => {
    cy.mount(<Skeleton />)
    cy.get("[class*='wave']").should("exist")
  })

  it("renders with pulse animation", () => {
    cy.mount(<Skeleton animation="pulse" />)
    cy.get("[class*='pulse']").should("exist")
  })

  it("has no accessibility violations", () => {
    cy.mount(<Skeleton height="20px" width="100%" />)
    cy.checkAccessibility()
  })
})
