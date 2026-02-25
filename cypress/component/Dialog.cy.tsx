import { Dialog } from "../../src/components/dialog"

describe("Dialog", () => {
  it("renders dialog when open=true", () => {
    cy.mount(
      <Dialog open title="Test dialog">
        <p>Dialog content</p>
      </Dialog>,
    )
    cy.get("[role='dialog']").should("exist")
    cy.contains("Test dialog").should("exist")
    cy.contains("Dialog content").should("exist")
  })

  it("does not render dialog when open=false", () => {
    cy.mount(
      <Dialog open={false} title="Hidden dialog">
        <p>Should not appear</p>
      </Dialog>,
    )
    cy.get("[role='dialog']").should("not.exist")
  })

  it("renders action buttons", () => {
    cy.mount(
      <Dialog
        open
        title="Confirm"
        actions={[
          { id: "cancel", title: "Cancel", onClick: cy.stub() },
          {
            id: "confirm",
            title: "Confirm",
            color: "primary",
            onClick: cy.stub(),
          },
        ]}
      >
        <p>Are you sure?</p>
      </Dialog>,
    )
    cy.contains("Cancel").should("exist")
    cy.contains("Confirm").should("exist")
  })

  it("has no accessibility violations when open", () => {
    cy.mount(
      <Dialog open title="Accessible dialog">
        <p>Well-structured dialog content for screen readers</p>
      </Dialog>,
    )
    cy.checkAccessibility()
  })

  it("has aria-modal attribute", () => {
    cy.mount(
      <Dialog open title="Modal dialog">
        <p>Content</p>
      </Dialog>,
    )
    cy.get("[role='dialog']").should("have.attr", "aria-modal", "true")
  })

  it("renders a close button by default", () => {
    cy.mount(
      <Dialog open title="Closeable">
        <p>Content</p>
      </Dialog>,
    )
    // Close button renders with text "Close" (no aria-label without translations)
    cy.contains("button", "Close").should("exist")
  })

  it("close button click calls onClose", () => {
    const onClose = cy.stub().as("onClose")
    cy.mount(
      <Dialog open title="Close test" onClose={onClose}>
        <p>Content</p>
      </Dialog>,
    )
    // Wait for Dialog lazy client to be fully rendered
    cy.get("[role='dialog']").should("be.visible")
    cy.contains("button", "Close").click()
    cy.get("@onClose").should("have.been.called")
  })

  it("Escape key triggers onChange with escapeKeyDown reason", () => {
    const onChange = cy.stub().as("onChange")
    cy.mount(
      <Dialog open title="Escape test" onChange={onChange}>
        <p>Content</p>
      </Dialog>,
    )
    // Wait for Dialog client + useEffect (keydown listener) to be ready
    cy.get("[role='dialog']").should("be.visible")
    cy.window().then(win => {
      win.dispatchEvent(
        new win.KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      )
    })
    cy.get("@onChange").should("have.been.called")
  })

  it("action button click calls its onClick handler", () => {
    const actionClick = cy.stub().as("actionClick")
    cy.mount(
      <Dialog
        open
        title="Action test"
        actions={[{ id: "ok", title: "OK", onClick: actionClick }]}
      >
        <p>Content</p>
      </Dialog>,
    )
    cy.contains("OK").click()
    cy.get("@actionClick").should("have.been.called")
  })

  it("hides close button when hideCloseButton=true", () => {
    cy.mount(
      <Dialog open title="No close" hideCloseButton>
        <p>Content</p>
      </Dialog>,
    )
    cy.contains("button", "Close").should("not.exist")
  })
})
