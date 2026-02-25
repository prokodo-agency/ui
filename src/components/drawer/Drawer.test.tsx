import { expect } from "@jest/globals"
import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { Drawer } from "./Drawer"

describe("The common drawer component", () => {
  it("should render drawer", async () => {
    const { container } = render(
      <Drawer anchor="right" open={true} onChange={jest.fn()} />,
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  it("has no axe violations when open", async () => {
    const { container } = render(
      <Drawer
        anchor="right"
        open={true}
        title="Navigation"
        onChange={jest.fn()}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations when closed", async () => {
    const { container } = render(
      <Drawer anchor="left" open={false} onChange={jest.fn()} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("renders custom header via renderHeader prop", () => {
    render(
      <Drawer
        open={true}
        renderHeader={() => <div>Custom Header</div>}
        onChange={jest.fn()}
      />,
    )
    expect(screen.getByText("Custom Header")).toBeInTheDocument()
  })
})
