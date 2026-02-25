import { ProgressBarView } from "../../src/components/progressBar/ProgressBar.view"

describe("ProgressBar", () => {
  it("renders progress bar element", () => {
    cy.mount(<ProgressBarView id="progress" value={50} />)
    cy.get("[role='progressbar']").should("exist")
  })

  it("renders with correct aria-valuenow", () => {
    cy.mount(<ProgressBarView id="progress" value={75} />)
    cy.get("[role='progressbar']").should("have.attr", "aria-valuenow", "75")
  })

  it("renders with aria-valuemin=0 and aria-valuemax=100", () => {
    cy.mount(<ProgressBarView id="progress" value={30} />)
    cy.get("[role='progressbar']")
      .should("have.attr", "aria-valuemin", "0")
      .and("have.attr", "aria-valuemax", "100")
  })

  it("renders with a visible label", () => {
    cy.mount(
      <ProgressBarView id="progress" label="Upload progress" value={60} />,
    )
    cy.contains("Upload progress").should("be.visible")
  })

  it("renders indeterminate state without value", () => {
    cy.mount(<ProgressBarView id="indeterminate" />)
    cy.get("[role='progressbar']").should("not.have.attr", "aria-valuenow")
  })

  it("has no accessibility violations", () => {
    cy.mount(<ProgressBarView id="a11y-progress" label="Loading" value={45} />)
    cy.checkAccessibility()
  })
})
