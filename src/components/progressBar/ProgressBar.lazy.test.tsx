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

describe("ProgressBar.lazy", () => {
  it("creates lazy wrapper with name 'ProgressBar' and is always interactive", () => {
    const ProgressBarLazy = require("./ProgressBar.lazy").default
    render(<ProgressBarLazy value={50} />)
    const wrapper = screen.getByTestId("lazy-wrapper")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveAttribute("data-name", "ProgressBar")
    expect(wrapper).toHaveAttribute("data-interactive", "true")
  })
})
