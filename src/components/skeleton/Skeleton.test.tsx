import { axe } from "jest-axe"

import { render } from "@/tests"

import { Skeleton } from "./Skeleton"

describe("Skeleton", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders with default props", () => {
      const { container } = render(<Skeleton />)
      expect(container.firstChild).toBeTruthy()
    })

    it("renders with variant=text", () => {
      const { container } = render(
        <Skeleton height="1rem" variant="text" width="80%" />,
      )
      expect(container.firstChild).toBeTruthy()
    })

    it("renders with variant=rectangular", () => {
      const { container } = render(
        <Skeleton height="200px" variant="rectangular" width="100%" />,
      )
      expect(container.firstChild).toBeTruthy()
    })

    it("renders with variant=circular", () => {
      const { container } = render(
        <Skeleton height="40px" variant="circular" width="40px" />,
      )
      expect(container.firstChild).toBeTruthy()
    })

    it("renders with animation=pulse", () => {
      const { container } = render(<Skeleton animation="pulse" />)
      expect(container.firstChild).toBeTruthy()
    })

    it("renders with animation=wave", () => {
      const { container } = render(<Skeleton animation="wave" />)
      expect(container.firstChild).toBeTruthy()
    })

    it("renders with animation=none", () => {
      const { container } = render(<Skeleton animation="none" />)
      expect(container.firstChild).toBeTruthy()
    })

    it("applies custom className", () => {
      const { container } = render(<Skeleton className="my-skeleton" />)
      expect(container.firstChild).toHaveClass("my-skeleton")
    })

    it("applies custom width and height via inline style", () => {
      const { container } = render(<Skeleton height="50px" width="200px" />)
      const el = container.firstChild as HTMLElement
      expect(el).toHaveStyle({ width: "200px" })
      expect(el).toHaveStyle({ height: "50px" })
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("default skeleton has no axe violations", async () => {
      const { container } = render(<Skeleton />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it("text variant skeleton has no axe violations", async () => {
      const { container } = render(
        <Skeleton height="1rem" variant="text" width="80%" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("circular variant skeleton has no axe violations", async () => {
      const { container } = render(
        <Skeleton height="40px" variant="circular" width="40px" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
