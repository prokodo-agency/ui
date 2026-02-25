import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

jest.mock("@/helpers/createLazyWrapper", () => ({
  createLazyWrapper: jest.fn(config => (props: Record<string, unknown>) => (
    <div
      data-hydrate-on-visible={config.hydrateOnVisible ? "true" : "false"}
      data-name={config.name}
      data-testid="lazy-wrapper"
      data-interactive={
        config.isInteractive ? String(config.isInteractive(props)) : "false"
      }
    />
  )),
}))

describe("Calendly.lazy", () => {
  it("creates lazy wrapper with name 'Calendly'", () => {
    const CalendlyLazy = require("./Calendly.lazy").default
    render(<CalendlyLazy url="https://calendly.com/test" />)
    const wrapper = screen.getByTestId("lazy-wrapper")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveAttribute("data-name", "Calendly")
    expect(wrapper).toHaveAttribute("data-interactive", "true")
    expect(wrapper).toHaveAttribute("data-hydrate-on-visible", "true")
  })
})
