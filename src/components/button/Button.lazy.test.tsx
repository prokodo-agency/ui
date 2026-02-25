import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

jest.mock("@/helpers/createLazyWrapper", () => ({
  createLazyWrapper: jest.fn(config => () => (
    <div
      data-interactive={config.isInteractive ? config.isInteractive() : false}
      data-name={config.name}
      data-testid="lazy-wrapper"
    >
      Lazy Wrapper Component
    </div>
  )),
}))

// Use top-level import so istanbul instruments the file at module init time
import ButtonLazy from "./Button.lazy"

describe("Button.lazy", () => {
  it("should create lazy wrapper with correct config", () => {
    render(<ButtonLazy title="Test" />)

    const wrapper = screen.getByTestId("lazy-wrapper")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveAttribute("data-name", "Button")
    expect(wrapper).toHaveAttribute("data-interactive", "false")
  })
})
