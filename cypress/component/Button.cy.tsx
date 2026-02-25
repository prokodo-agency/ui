// ButtonLazy is the createLazyWrapper component that renders ButtonClient synchronously
// when interactive (no React.lazy/Suspense delay), making it reliable for Cypress tests.
import ButtonLazy from "../../src/components/button/Button.lazy"

describe("Button", () => {
  it("renders with label", () => {
    cy.mount(<ButtonLazy title="Click me" />)
    cy.contains("Click me").should("be.visible")
  })

  it("calls onClick handler", () => {
    const onClick = cy.stub().as("clickHandler")
    cy.mount(<ButtonLazy title="Action" onClick={onClick} />)
    cy.get("button").click()
    cy.get("@clickHandler").should("have.been.calledOnce")
  })

  it("is disabled when disabled=true", () => {
    cy.mount(<ButtonLazy disabled title="Disabled" />)
    cy.get("button").should("be.disabled")
  })

  it("has no accessibility violations", () => {
    cy.mount(<ButtonLazy title="Accessible button" />)
    cy.checkAccessibility("button")
  })

  it("renders as a link when href is provided", () => {
    cy.mount(
      <ButtonLazy
        redirect={{ href: "https://example.com" }}
        title="Visit site"
      />,
    )
    cy.get("a").should("have.attr", "href", "https://example.com")
  })

  it("renders icon-only button with aria-label", () => {
    cy.mount(
      <ButtonLazy aria-label="Close" iconProps={{ name: "Cancel01Icon" }} />,
    )
    cy.get("button").should("have.attr", "aria-label", "Close")
  })

  it("renders contained variant by default", () => {
    cy.mount(<ButtonLazy title="Contained" />)
    cy.get("button")
      .invoke("attr", "class")
      .should("contain", "has-variant-contained")
  })

  it("renders outlined variant", () => {
    cy.mount(<ButtonLazy title="Outlined" variant="outlined" />)
    cy.get("button")
      .invoke("attr", "class")
      .should("contain", "has-variant-outlined")
  })
})
