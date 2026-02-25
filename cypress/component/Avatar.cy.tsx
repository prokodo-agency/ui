import { Icon } from "../../src/components/icon"
import { AvatarView } from "../../src/components/avatar/Avatar.view"

describe("Avatar", () => {
  it("renders with an image", () => {
    cy.mount(
      <AvatarView
        image={{ src: "https://via.placeholder.com/48", alt: "User avatar" }}
      />,
    )
    cy.get("img").should("have.attr", "alt", "User avatar")
  })

  it("renders with an icon when no image is provided", () => {
    cy.mount(<AvatarView iconOverride={<Icon name="User02Icon" />} />)
    // Icon renders as a span with role='presentation' (no label) or role='img' (with label)
    cy.get("[role='img'], [role='presentation']").should("exist")
  })

  it("renders initials text when provided", () => {
    cy.mount(<AvatarView iconOverride={<span>JD</span>} />)
    cy.contains("JD").should("be.visible")
  })

  it("wraps in a link when redirect is provided", () => {
    cy.mount(
      <AvatarView
        image={{ src: "https://via.placeholder.com/48", alt: "User" }}
        redirect={{ href: "/profile" }}
      />,
    )
    cy.get("a").should("have.attr", "href", "/profile")
  })

  it("applies size variant", () => {
    cy.mount(
      <AvatarView
        image={{ src: "https://via.placeholder.com/48", alt: "User" }}
        size="md"
      />,
    )
    cy.get("[class*='has-size-md']").should("exist")
  })

  it("has no accessibility violations", () => {
    cy.mount(
      <AvatarView
        image={{ src: "https://via.placeholder.com/48", alt: "User avatar" }}
      />,
    )
    cy.checkAccessibility()
  })
})
