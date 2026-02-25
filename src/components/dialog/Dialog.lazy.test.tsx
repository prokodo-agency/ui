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

describe("Dialog.lazy", () => {
  it("creates lazy wrapper with name 'Dialog' and is always interactive", () => {
    const DialogLazy = require("./Dialog.lazy").default
    render(<DialogLazy actions={[]} id="test" title="Test" />)
    const wrapper = screen.getByTestId("lazy-wrapper")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveAttribute("data-name", "Dialog")
    expect(wrapper).toHaveAttribute("data-interactive", "true")
  })
})
