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

describe("Snackbar.lazy", () => {
  it("creates lazy wrapper with name 'Snackbar'", () => {
    const SnackbarLazy = require("./Snackbar.lazy").default
    render(<SnackbarLazy />)
    const wrapper = screen.getByTestId("lazy-wrapper")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveAttribute("data-name", "Snackbar")
    expect(wrapper).toHaveAttribute("data-interactive", "false")
  })
})
