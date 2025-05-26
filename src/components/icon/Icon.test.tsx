import { render, screen } from "@/tests"

import { Icon } from "./Icon"

describe("The common icon component", () => {
  it("renders a decorative <img>", () => {
    render(<Icon name="AbacusIcon" />)

    // „presentation“ + hidden, weil aria-hidden="true"
    const img = screen.getByRole("presentation", { hidden: true })

    expect(img).toBeInTheDocument()
    expect(img.tagName).toBe("IMG")
    expect(img).toHaveAttribute("src", expect.stringContaining("abacus_icon.svg"))
    expect(img).toHaveAttribute("aria-hidden", "true")
  })

  it("allows custom accessibility attributes", () => {
    render(<Icon aria-hidden="false" name="AccessIcon" role="alert" />)

    const img = screen.getByRole("alert")
    expect(img).toHaveAttribute("role", "alert")
    expect(img).toHaveAttribute("aria-hidden", "false")
  })

  it("applies default size", () => {
    render(<Icon name="AbsoluteIcon" />)

    const img = screen.getByRole("presentation", { hidden: true })
    expect(img).toHaveAttribute("width", "16")
    expect(img).toHaveAttribute("height", "16")
  })

  it("applies size `lg`", () => {
    render(<Icon name="AbsoluteIcon" size="lg" />)

    const img = screen.getByRole("presentation", { hidden: true })
    expect(img).toHaveAttribute("width", "40")
    expect(img).toHaveAttribute("height", "40")
  })
})
