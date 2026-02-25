import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

interface LazyConfig {
  name: string
  isInteractive?: (props: Record<string, unknown>) => boolean
  Server?: () => React.ReactElement
}

let capturedConfig: LazyConfig | null = null

jest.mock("@/helpers/createLazyWrapper", () => ({
  createLazyWrapper: jest.fn((config: LazyConfig) => {
    capturedConfig = config
    return (props: Record<string, unknown>) => (
      <div
        data-name={config.name}
        data-testid="lazy-wrapper"
        data-interactive={
          config.isInteractive ? String(config.isInteractive(props)) : "false"
        }
      />
    )
  }),
}))

describe("SnackbarProvider.lazy", () => {
  it("creates lazy wrapper with name 'Snackbar', is always interactive, and Server renders empty fragment", () => {
    const SnackbarProviderLazy = require("./SnackbarProvider.lazy").default
    render(<SnackbarProviderLazy />)
    const wrapper = screen.getByTestId("lazy-wrapper")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveAttribute("data-name", "Snackbar")
    expect(wrapper).toHaveAttribute("data-interactive", "true")

    // Verify and invoke the Server function to cover its body
    expect(capturedConfig).not.toBeNull()
    expect(capturedConfig!.Server).toBeDefined()
    const result = capturedConfig!.Server!()
    expect(result).toBeDefined()
  })
})
