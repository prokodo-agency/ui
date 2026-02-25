import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { AvatarView } from "./Avatar.view"

describe("Avatar", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders a default avatar with UserIcon placeholder", () => {
      const { container } = render(<AvatarView />)
      expect(container.firstChild).toBeTruthy()
    })

    it("renders an image when image prop is provided", () => {
      render(
        <AvatarView image={{ src: "/user-photo.jpg", alt: "User photo" }} />,
      )
      expect(screen.getByAltText("User photo")).toBeInTheDocument()
    })

    it("renders a link when redirect is provided", () => {
      render(
        <AvatarView
          image={{ src: "/user.jpg", alt: "User" }}
          redirect={{ href: "/profile" }}
        />,
      )
      expect(screen.getByRole("link")).toHaveAttribute("href", "/profile")
    })

    it("does not render a link without redirect prop", () => {
      render(<AvatarView />)
      expect(screen.queryByRole("link")).not.toBeInTheDocument()
    })

    it("renders with 'primary' variant class", () => {
      const { container } = render(<AvatarView variant="primary" />)
      expect(container.firstChild).toHaveClass("prokodo-Avatar--primary")
    })

    it("renders with small size class", () => {
      const { container } = render(<AvatarView size="sm" />)
      expect(container.firstChild).toHaveClass("prokodo-Avatar--has-size-sm")
    })

    it("renders with large size class", () => {
      const { container } = render(<AvatarView size="lg" />)
      expect(container.firstChild).toHaveClass("prokodo-Avatar--has-size-lg")
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("avatar with image has no axe violations", async () => {
      const { container } = render(
        <AvatarView image={{ src: "/photo.jpg", alt: "Profile picture" }} />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("avatar without image has no axe violations", async () => {
      const { container } = render(<AvatarView />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it("avatar as link has no axe violations", async () => {
      const { container } = render(
        <AvatarView
          redirect={{ href: "/profile", "aria-label": "View profile" }}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
