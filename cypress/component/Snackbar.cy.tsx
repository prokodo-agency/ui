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

  it("error color has no accessibility violations", () => {
    cy.mount(<SnackbarView color="error" message="An error occurred" />)
    cy.checkAccessibility()
  })

  it("renders with color=success", () => {
    cy.mount(<SnackbarView color="success" message="Saved successfully" />)
    cy.contains("Saved successfully").should("be.visible")
  })

  it("renders with color=warning", () => {
    cy.mount(
      <SnackbarView color="warning" message="Please review your input" />,
    )
    cy.contains("Please review your input").should("be.visible")
  })

  it("renders with color=info", () => {
    cy.mount(<SnackbarView color="info" message="New update available" />)
    cy.contains("New update available").should("be.visible")
  })

  it("success color has no accessibility violations", () => {
    cy.mount(<SnackbarView color="success" message="Record saved" />)
    cy.checkAccessibility()
  })

  it("warning color has no accessibility violations", () => {
    cy.mount(<SnackbarView color="warning" message="Low storage" />)
    cy.checkAccessibility()
  })
})
