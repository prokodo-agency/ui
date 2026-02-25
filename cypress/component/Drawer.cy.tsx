import { Drawer } from "../../src/components/drawer"
import DrawerClient from "../../src/components/drawer/Drawer.client"

describe("Drawer", () => {
  it("renders drawer when open=true", () => {
    cy.mount(
      <Drawer open>
        <p>Drawer content</p>
      </Drawer>,
    )
    cy.contains("Drawer content").should("exist")
  })

  it("hides drawer when open=false", () => {
    cy.mount(
      <Drawer open={false}>
        <p>Hidden content</p>
      </Drawer>,
    )
    cy.contains("Hidden content").should("not.exist")
  })

  it("has no accessibility violations when open", () => {
    cy.mount(
      <Drawer open>
        <nav aria-label="Mobile navigation">
          <ul>
            <li>
              <a href="/home">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
          </ul>
        </nav>
      </Drawer>,
    )
    cy.checkAccessibility()
  })

  it("renders the title when title prop is provided", () => {
    cy.mount(
      <Drawer open title="Navigation">
        <p>Content</p>
      </Drawer>,
    )
    cy.contains("Navigation").should("be.visible")
  })

  it("shows a close button when title is provided", () => {
    cy.mount(
      <Drawer open title="My Drawer">
        <p>Content</p>
      </Drawer>,
    )
    cy.get("[aria-label='Close drawer']").should("exist")
  })

  it("close button click calls onChange with escapeKeyDown", () => {
    const onChange = cy.stub().as("onChange")
    // Use DrawerClient directly to avoid island lazy-loading race condition
    cy.mount(
      <DrawerClient open title="Close test" onChange={onChange}>
        <p>Content</p>
      </DrawerClient>,
    )
    // Wait for drawer to be fully rendered
    cy.contains("Content").should("be.visible")
    cy.get("[aria-label='Close drawer']").click()
    cy.get("@onChange").should("have.been.called")
  })

  it("Escape key triggers onChange with escapeKeyDown", () => {
    const onChange = cy.stub().as("onChange")
    // Use DrawerClient directly to avoid island lazy-loading race condition
    cy.mount(
      <DrawerClient open title="Escape test" onChange={onChange}>
        <p>Content</p>
      </DrawerClient>,
    )
    // Wait for drawer to render and useEffect (keydown listener) to register
    cy.contains("Content").should("be.visible")
    cy.document().then(doc => {
      doc.dispatchEvent(
        new doc.defaultView!.KeyboardEvent("keydown", {
          key: "Escape",
          bubbles: true,
        }),
      )
    })
    cy.get("@onChange").should("have.been.called")
  })

  it("titled drawer has no accessibility violations", () => {
    cy.mount(
      <Drawer open title="Accessible drawer">
        <p>Drawer body content</p>
      </Drawer>,
    )
    cy.checkAccessibility()
  })
})
