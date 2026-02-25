import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

jest.mock("@/helpers/createLazyWrapper", () => ({
  createLazyWrapper: jest.fn(config => (props: Record<string, unknown>) => (
    <div
      data-name={config.name}
      data-testid="lazy-wrapper"
      data-interactive={
        config.isInteractive ? String(config.isInteractive(props)) : "false"
      }
    />
  )),
}))

describe("SideNav.lazy", () => {
  it("creates lazy wrapper with name 'SideNav' and is always interactive", () => {
    const SideNavLazy = require("./SideNav.lazy").default
    render(<SideNavLazy collapsed={false} items={[]} />)
    const wrapper = screen.getByTestId("lazy-wrapper")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveAttribute("data-name", "SideNav")
    expect(wrapper).toHaveAttribute("data-interactive", "true")
  })
})
