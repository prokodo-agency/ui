import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { ProgressBar } from "./ProgressBar"

describe("ProgressBar", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders with a determinate value", () => {
      render(<ProgressBar id="progress" value={60} />)
      const bar = screen.getByRole("progressbar")
      expect(bar).toBeInTheDocument()
      expect(bar).toHaveAttribute("aria-valuenow", "60")
    })

    it("renders indeterminate when value is not provided", () => {
      render(<ProgressBar id="indeterminate" />)
      const bar = screen.getByRole("progressbar")
      expect(bar).toBeInTheDocument()
      expect(bar).not.toHaveAttribute("aria-valuenow")
    })

    it("renders with a label", () => {
      render(<ProgressBar id="with-label" label="Uploading… 60%" value={60} />)
      expect(screen.getByText("Uploading… 60%")).toBeInTheDocument()
    })

    it("hides label when hideLabel=true", () => {
      render(
        <ProgressBar
          hideLabel
          id="hidden-label"
          label="Uploading"
          value={60}
        />,
      )
      expect(screen.queryByText("Uploading")).not.toBeInTheDocument()
    })

    it("clamps value to 0–100 range", () => {
      render(<ProgressBar id="clamp" value={150} />)
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuenow",
        "100",
      )
    })

    it("renders with variant=success", () => {
      render(<ProgressBar id="success" value={80} variant="success" />)
      expect(screen.getByRole("progressbar")).toBeInTheDocument()
    })

    it("renders with infinity=true", () => {
      render(<ProgressBar infinity id="infinity" />)
      expect(screen.getByRole("progressbar")).toBeInTheDocument()
    })

    it("applies custom className", () => {
      const { container } = render(
        <ProgressBar className="my-progress" id="cls" value={50} />,
      )
      expect(container.firstChild).toHaveClass("my-progress")
    })

    it("has aria-valuemin and aria-valuemax", () => {
      render(<ProgressBar id="aria" value={50} />)
      const bar = screen.getByRole("progressbar")
      expect(bar).toHaveAttribute("aria-valuemin", "0")
      expect(bar).toHaveAttribute("aria-valuemax", "100")
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("determinate progress bar has no axe violations", async () => {
      const { container } = render(
        <ProgressBar id="a11y-det" label="Upload progress" value={60} />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("indeterminate progress bar has no axe violations", async () => {
      const { container } = render(
        <ProgressBar aria-label="Loading" id="a11y-indet" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("infinity progress bar has no axe violations", async () => {
      const { container } = render(
        <ProgressBar infinity aria-label="Loading" id="a11y-inf" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
