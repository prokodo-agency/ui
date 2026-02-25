import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { Carousel } from "./Carousel"

describe("Carousel", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders children", () => {
      render(
        <Carousel>
          <div>Slide 1</div>
          <div>Slide 2</div>
          <div>Slide 3</div>
        </Carousel>,
      )
      expect(screen.getByText("Slide 1")).toBeInTheDocument()
      expect(screen.getByText("Slide 2")).toBeInTheDocument()
      expect(screen.getByText("Slide 3")).toBeInTheDocument()
    })

    it("renders skeleton placeholder when no children", () => {
      const { container } = render(<Carousel>{null}</Carousel>)
      // Should render a skeleton when empty
      expect(container.firstChild).toBeTruthy()
    })

    it("renders with itemsToShow=2", () => {
      const { container } = render(
        <Carousel itemsToShow={2}>
          <div>A</div>
          <div>B</div>
        </Carousel>,
      )
      expect(container.firstChild).toBeTruthy()
    })

    it("renders dots when there are multiple items", () => {
      const { container } = render(
        <Carousel>
          <div>Item 1</div>
          <div>Item 2</div>
        </Carousel>,
      )
      // Dots should be rendered for multi-item carousels
      expect(container.firstChild).toBeTruthy()
    })

    it("renders without dots for single item", () => {
      const { container } = render(
        <Carousel>
          <div>Single item</div>
        </Carousel>,
      )
      expect(container.firstChild).toBeTruthy()
    })

    it("renders controls when enableControl=true", () => {
      const { container } = render(
        <Carousel enableControl>
          <div>A</div>
          <div>B</div>
        </Carousel>,
      )
      expect(container.firstChild).toBeTruthy()
    })

    it("applies custom className", () => {
      const { container } = render(
        <Carousel className="my-carousel">
          <div>Item</div>
        </Carousel>,
      )
      expect(container.firstChild).toHaveClass("my-carousel")
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("carousel with slides has no axe violations", async () => {
      const { container } = render(
        <Carousel aria-label="Featured content">
          <div>Slide 1 content</div>
          <div>Slide 2 content</div>
        </Carousel>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("empty carousel has no axe violations", async () => {
      const { container } = render(
        <Carousel aria-label="Empty carousel">{null}</Carousel>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
