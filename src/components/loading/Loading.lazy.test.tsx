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

describe("Loading.lazy", () => {
  it("creates lazy wrapper with name 'Loading' and is always interactive", () => {
    const LoadingLazy = require("./Loading.lazy").default
    render(<LoadingLazy />)
    const wrapper = screen.getByTestId("lazy-wrapper")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveAttribute("data-name", "Loading")
    expect(wrapper).toHaveAttribute("data-interactive", "true")
  })
})
