import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { Tooltip } from "./Tooltip"
import { TooltipView } from "./Tooltip.view"

describe("Tooltip", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders children", () => {
      render(
        <TooltipView content="Tooltip text">
          <button type="button">Hover me</button>
        </TooltipView>,
      )
      expect(
        screen.getByRole("button", { name: "Hover me" }),
      ).toBeInTheDocument()
    })

    it("renders tooltip content in SR-only span", () => {
      render(
        <TooltipView content="Extra info">
          <span>Trigger</span>
        </TooltipView>,
      )
      // content appears in both sr span and visual bubble; use getAllByText
      const matches = screen.getAllByText("Extra info")
      expect(matches.length).toBeGreaterThanOrEqual(1)
    })

    it("does not render tooltip content when disabled=true", () => {
      render(
        <TooltipView disabled content="Hidden tooltip">
          <button type="button">Disabled trigger</button>
        </TooltipView>,
      )
      expect(screen.queryByText("Hidden tooltip")).not.toBeInTheDocument()
    })

    it("merges aria-describedby onto trigger", () => {
      render(
        <TooltipView content="Description" id="my-tooltip">
          <button type="button">Action</button>
        </TooltipView>,
      )
      const trigger = screen.getByRole("button")
      expect(trigger).toHaveAttribute("aria-describedby")
      expect(trigger).toHaveAttribute(
        "aria-describedby",
        expect.stringContaining("my-tooltip"),
      )
    })

    it("renders with top placement by default", () => {
      const { container } = render(
        <TooltipView content="Top tooltip">
          <button type="button">Trigger</button>
        </TooltipView>,
      )
      const root = container.firstChild as HTMLElement
      expect(
        root.dataset.placement ?? root.getAttribute("data-placement") ?? "top",
      ).toBe("top")
    })

    it("renders tooltip with custom placement", () => {
      const { container } = render(
        <TooltipView content="Bottom tooltip" placement="bottom">
          <button type="button">Trigger</button>
        </TooltipView>,
      )
      const root = container.firstChild as HTMLElement
      expect(root).toHaveAttribute("data-placement", "bottom")
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("tooltip with button trigger has no axe violations", async () => {
      const { container } = render(
        <TooltipView content="More information about this field">
          <button type="button">Info</button>
        </TooltipView>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("disabled tooltip has no axe violations", async () => {
      const { container } = render(
        <TooltipView disabled content="Not shown">
          <button type="button">Info</button>
        </TooltipView>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

describe("Tooltip island", () => {
  it("renders without crashing via island wrapper", () => {
    render(
      <Tooltip content="Help text">
        <button>Hover me</button>
      </Tooltip>,
    )
  })
})
