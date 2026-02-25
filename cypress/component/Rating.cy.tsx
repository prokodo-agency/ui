import { RatingView } from "../../src/components/rating/Rating.view"

const defaultStars = { name: "rating", label: "Rate this product" }

describe("Rating", () => {
  it("renders with label", () => {
    cy.mount(<RatingView {...defaultStars} />)
    cy.contains("Rate this product").should("be.visible")
  })

  it("renders 5 star buttons by default", () => {
    cy.mount(<RatingView {...defaultStars} />)
    cy.get("[role='radio']").should("have.length", 5)
  })

  it("renders custom max stars", () => {
    cy.mount(<RatingView {...defaultStars} max={3} />)
    cy.get("[role='radio']").should("have.length", 3)
  })

  it("renders with a selected value", () => {
    cy.mount(<RatingView {...defaultStars} value={3} />)
    cy.get("[role='radio'][aria-checked='true']").should("exist")
  })

  it("renders as disabled", () => {
    cy.mount(<RatingView {...defaultStars} disabled />)
    cy.get("[role='radiogroup']").should("have.attr", "aria-disabled", "true")
  })

  it("has role=radiogroup", () => {
    cy.mount(<RatingView {...defaultStars} />)
    cy.get("[role='radiogroup']").should("exist")
  })

  it("has no accessibility violations", () => {
    cy.mount(<RatingView {...defaultStars} />)
    cy.checkAccessibility()
  })

  it("with value has no accessibility violations", () => {
    cy.mount(<RatingView {...defaultStars} value={4} />)
    cy.checkAccessibility()
  })

  it("clicking a star calls onClick", () => {
    const onClick = cy.stub().as("onClick")
    cy.mount(<RatingView {...defaultStars} onClick={onClick} />)
    cy.get("[role='radio']").eq(2).click()
    cy.get("@onClick").should("have.been.called")
  })

  it("stars have descriptive aria labels", () => {
    cy.mount(<RatingView {...defaultStars} />)
    cy.get("[role='radio']").eq(0).should("have.attr", "aria-label", "1 star")
    cy.get("[role='radio']").eq(1).should("have.attr", "aria-label", "2 stars")
    cy.get("[role='radio']").eq(4).should("have.attr", "aria-label", "5 stars")
  })

  it("selected star has aria-checked=true", () => {
    cy.mount(<RatingView {...defaultStars} value={3} />)
    cy.get("[role='radio']").eq(2).should("have.attr", "aria-checked", "true")
  })

  it("disabled rating does not fire onClick", () => {
    const onClick = cy.stub().as("onClick")
    cy.mount(<RatingView {...defaultStars} disabled onClick={onClick} />)
    cy.get("[role='radio']").eq(0).click({ force: true })
    cy.get("@onClick").should("not.have.been.called")
  })
})
