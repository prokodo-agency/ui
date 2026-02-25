import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { Grid } from "./Grid"
import { GridRow } from "./GridRow"

describe("Grid", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders children", () => {
      render(
        <Grid>
          <div>Item</div>
        </Grid>,
      )
      expect(screen.getByText("Item")).toBeInTheDocument()
    })

    it("renders multiple children", () => {
      render(
        <Grid>
          <div>A</div>
          <div>B</div>
          <div>C</div>
        </Grid>,
      )
      expect(screen.getByText("A")).toBeInTheDocument()
      expect(screen.getByText("B")).toBeInTheDocument()
      expect(screen.getByText("C")).toBeInTheDocument()
    })

    it("applies custom className", () => {
      const { container } = render(
        <Grid className="my-grid">
          <div>X</div>
        </Grid>,
      )
      expect(container.firstChild).toHaveClass("my-grid")
    })

    it("applies spacing via gap style", () => {
      const { container } = render(
        <Grid spacing={4}>
          <div>X</div>
        </Grid>,
      )
      const el = container.firstChild as HTMLElement
      expect(el).toHaveStyle({ gap: "32px" })
    })

    it("renders without children", () => {
      const { container } = render(<Grid />)
      expect(container.firstChild).toBeTruthy()
    })
  })

  describe("GridRow", () => {
    it("renders children inside GridRow", () => {
      render(
        <GridRow>
          <div>Row item</div>
        </GridRow>,
      )
      expect(screen.getByText("Row item")).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("Grid with items has no axe violations", async () => {
      const { container } = render(
        <Grid>
          <div>Item 1</div>
          <div>Item 2</div>
        </Grid>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("empty Grid has no axe violations", async () => {
      const { container } = render(<Grid />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
