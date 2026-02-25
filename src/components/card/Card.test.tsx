import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { Card } from "./Card"

describe("Card", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders children", () => {
      render(
        <Card>
          <p>Card content</p>
        </Card>,
      )
      expect(screen.getByText("Card content")).toBeInTheDocument()
    })

    it("renders with loading state", () => {
      const { container } = render(
        <Card loading>
          <p>Loading content</p>
        </Card>,
      )
      expect(container.firstChild).toBeTruthy()
    })

    it("renders with highlight prop", () => {
      const { container } = render(
        <Card highlight>
          <p>Highlighted card</p>
        </Card>,
      )
      expect(container.firstChild).toBeTruthy()
    })

    it("renders with all variant types", () => {
      const variants = [
        "primary",
        "secondary",
        "success",
        "error",
        "info",
        "warning",
        "white",
        "panel",
      ] as const
      variants.forEach(variant => {
        const { unmount } = render(
          <Card variant={variant}>
            <p>{variant}</p>
          </Card>,
        )
        expect(screen.getByText(variant)).toBeInTheDocument()
        unmount()
      })
    })

    it("renders with custom className", () => {
      const { container } = render(
        <Card className="my-card">
          <p>Card</p>
        </Card>,
      )
      // eslint-disable-next-line testing-library/no-container
      expect(container.querySelector(".my-card")).toBeTruthy()
    })

    it("renders with enableShadow prop", () => {
      const { container } = render(
        <Card enableShadow>
          <p>Shadow card</p>
        </Card>,
      )
      expect(container.firstChild).toBeTruthy()
    })

    it("renders with gradiant prop", () => {
      const { container } = render(
        <Card gradiant>
          <p>Gradient card</p>
        </Card>,
      )
      expect(container.firstChild).toBeTruthy()
    })

    it("renders empty card without children", () => {
      const { container } = render(<Card>{null}</Card>)
      expect(container.firstChild).toBeTruthy()
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("card with content has no axe violations", async () => {
      const { container } = render(
        <Card>
          <p>Card with accessible content</p>
        </Card>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("highlighted card has no axe violations", async () => {
      const { container } = render(
        <Card highlight>
          <p>Important card</p>
        </Card>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
