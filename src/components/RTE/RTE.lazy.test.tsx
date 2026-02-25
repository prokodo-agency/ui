import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

// RTE.client imports quill CSS which uses Vite's ?inline syntax not available in Jest
jest.mock("./RTE.client", () => ({ __esModule: true, default: () => null }))
jest.mock("./RTE.server", () => ({ __esModule: true, default: () => null }))

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

describe("RTE.lazy", () => {
  it("creates lazy wrapper with name 'RTE'", () => {
    const RTELazy = require("./RTE.lazy").default
    render(<RTELazy />)
    const wrapper = screen.getByTestId("lazy-wrapper")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveAttribute("data-name", "RTE")
    expect(wrapper).toHaveAttribute("data-interactive", "false")
  })
})
