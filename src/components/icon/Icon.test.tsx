import { render, screen } from "@/tests"

import { Icon } from "./Icon"

describe("The common Icon component", () => {
  it("renders a decorative icon with correct mask URL", () => {
    render(<Icon name="AbacusIcon" />)

    const icon = screen.getByRole("presentation", { hidden: true })
    expect(icon).toBeInTheDocument()
    expect(icon.tagName).toBe("SPAN")
    expect(icon).toHaveAttribute("aria-hidden", "true")

    // Check inline styles directly
    expect(icon).toHaveStyle({ width: "16px" })
    expect(icon).toHaveStyle({ height: "16px" })
    expect(icon).toHaveStyle({ backgroundColor: "currentColor" })
    expect(icon.style.maskImage).toContain("abacus_icon.svg")
  })

  it("renders an accessible icon when label is provided", () => {
    render(<Icon label="Access" name="AccessIcon" />)

    const icon = screen.getByRole("img", { name: "Access" })
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveAttribute("aria-label", "Access")
    expect(icon).not.toHaveAttribute("aria-hidden")
  })

  it("applies default size (`16px`)", () => {
    render(<Icon name="AbsoluteIcon" />)

    const icon = screen.getByRole("presentation", { hidden: true })
    expect(icon).toHaveStyle({ width: "16px" })
    expect(icon).toHaveStyle({ height: "16px" })
  })

  it("applies size `lg` (`40px`)", () => {
    render(<Icon name="AbsoluteIcon" size="lg" />)

    const icon = screen.getByRole("presentation", { hidden: true })
    expect(icon).toHaveStyle({ width: "40px" })
    expect(icon).toHaveStyle({ height: "40px" })
  })
})
