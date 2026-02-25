import { render, screen } from "@/tests"

import { DrawerView } from "./Drawer.view"

jest.mock("./Drawer.effects.client", () => ({
  DrawerEffectsLoader: () => null,
}))

describe("DrawerView", () => {
  it("renders with open=true (aria-modal)", () => {
    render(<DrawerView open onChange={jest.fn()} />)
    const container = screen.getByRole("dialog")
    expect(container).toHaveAttribute("aria-modal", "true")
    expect(container).not.toHaveAttribute("aria-hidden")
  })

  it("renders with open=false (aria-hidden + inert)", () => {
    render(<DrawerView open={false} onChange={jest.fn()} />)
    const container = screen.getByRole("dialog", { hidden: true })
    expect(container).toHaveAttribute("aria-hidden", "true")
  })
})
