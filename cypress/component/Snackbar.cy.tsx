import { SnackbarView } from "../../src/components/snackbar/Snackbar.view"

describe("Snackbar", () => {
  it("renders with a message", () => {
    cy.mount(<SnackbarView message="Your changes have been saved" />)
    cy.contains("Your changes have been saved").should("be.visible")
  })

  it("renders close button", () => {
    cy.mount(<SnackbarView message="Item deleted" />)
    cy.get("[aria-label='Close']").should("be.visible")
  })

  it("calls onClose when close button is clicked", () => {
    const onClose = cy.stub().as("onClose")
    cy.mount(<SnackbarView message="Notification" onClose={onClose} />)
    cy.get("[aria-label='Close']").click()
    cy.get("@onClose").should("have.been.calledWith", "closeIcon")
  })

  it("renders without close button when closeable=false", () => {
    cy.mount(
      <SnackbarView closeable={false} message="Persistent notification" />,
    )
    cy.get("[aria-label='Close']").should("not.exist")
  })

  it("has role=status for polite announcements", () => {
    cy.mount(<SnackbarView message="Status update" />)
    cy.get("[role='status']").should("exist")
  })

  it("has no accessibility violations", () => {
    cy.mount(<SnackbarView message="Changes saved" />)
    cy.checkAccessibility()
  })

  it("error snackbar has no accessibility violations", () => {
    cy.mount(<SnackbarView message="An error occurred" variant="error" />)
    cy.checkAccessibility()
  })

  it("renders with variant=success", () => {
    cy.mount(<SnackbarView message="Saved successfully" variant="success" />)
    cy.contains("Saved successfully").should("be.visible")
  })

  it("renders with variant=warning", () => {
    cy.mount(
      <SnackbarView message="Please review your input" variant="warning" />,
    )
    cy.contains("Please review your input").should("be.visible")
  })

  it("renders with variant=info", () => {
    cy.mount(<SnackbarView message="New update available" variant="info" />)
    cy.contains("New update available").should("be.visible")
  })

  it("success variant has no accessibility violations", () => {
    cy.mount(<SnackbarView message="Record saved" variant="success" />)
    cy.checkAccessibility()
  })

  it("warning variant has no accessibility violations", () => {
    cy.mount(<SnackbarView message="Low storage" variant="warning" />)
    cy.checkAccessibility()
  })
})
