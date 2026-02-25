import { Link } from "../../src/components/link"

describe("Link", () => {
  it("renders link text", () => {
    cy.mount(<Link href="/about">About us</Link>)
    cy.contains("About us").should("be.visible")
  })

  it("renders with correct href", () => {
    cy.mount(<Link href="/contact">Contact</Link>)
    cy.get("a").should("have.attr", "href", "/contact")
  })

  it("renders as external link with target=_blank", () => {
    cy.mount(
      <Link href="https://example.com" target="_blank">
        External
      </Link>,
    )
    cy.get("a").should("have.attr", "target", "_blank")
  })

  it("has no accessibility violations", () => {
    cy.mount(<Link href="/home">Home</Link>)
    cy.checkAccessibility()
  })

  it("external link has rel=noopener noreferrer", () => {
    cy.mount(
      <Link href="https://example.com" target="_blank">
        External
      </Link>,
    )
    cy.get("a").should("have.attr", "rel", "noopener noreferrer")
  })

  it("internal link does not have rel attribute", () => {
    cy.mount(<Link href="/about">About</Link>)
    cy.get("a").should("not.have.attr", "rel")
  })

  it("external link opens in new tab by default", () => {
    cy.mount(<Link href="https://example.com">External</Link>)
    cy.get("a").should("have.attr", "target", "_blank")
  })
})
