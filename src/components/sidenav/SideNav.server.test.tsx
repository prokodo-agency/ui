import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import SideNavServer from "./SideNav.server"

jest.mock("./SideNav.view", () => ({
  __esModule: true,
  default: ({
    interactive,
    collapsed,
  }: {
    interactive?: boolean
    collapsed?: boolean
  }) => (
    <div
      data-collapsed={String(collapsed)}
      data-interactive={String(interactive)}
      data-testid="view"
    />
  ),
}))

describe("SideNavServer", () => {
  it("renders with required items prop", () => {
    render(<SideNavServer items={[]} />)
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })

  it("forces interactive=false", () => {
    render(<SideNavServer items={[]} />)
    expect(screen.getByTestId("view")).toHaveAttribute(
      "data-interactive",
      "false",
    )
  })

  it("defaults collapsed=false when initialCollapsed is undefined", () => {
    render(<SideNavServer items={[]} />)
    expect(screen.getByTestId("view")).toHaveAttribute(
      "data-collapsed",
      "false",
    )
  })

  it("uses initialCollapsed=true when provided", () => {
    render(<SideNavServer initialCollapsed items={[]} />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-collapsed", "true")
  })
})
