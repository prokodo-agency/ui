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

describe("Card.lazy", () => {
  it("creates lazy wrapper with name 'Card'", () => {
    const CardLazy = require("./Card.lazy").default
    render(<CardLazy />)
    const wrapper = screen.getByTestId("lazy-wrapper")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveAttribute("data-name", "Card")
  })

  it("is interactive when onClick is provided and not disabled", () => {
    const CardLazy = require("./Card.lazy").default
    render(<CardLazy onClick={() => undefined} />)
    expect(screen.getByTestId("lazy-wrapper")).toHaveAttribute(
      "data-interactive",
      "true",
    )
  })

  it("is interactive when redirect.href is provided", () => {
    const CardLazy = require("./Card.lazy").default
    render(<CardLazy redirect={{ href: "/page" }} />)
    expect(screen.getByTestId("lazy-wrapper")).toHaveAttribute(
      "data-interactive",
      "true",
    )
  })

  it("is NOT interactive when disabled with onClick", () => {
    const CardLazy = require("./Card.lazy").default
    render(<CardLazy disabled onClick={() => undefined} />)
    expect(screen.getByTestId("lazy-wrapper")).toHaveAttribute(
      "data-interactive",
      "false",
    )
  })

  it("is NOT interactive when no onClick and no redirect", () => {
    const CardLazy = require("./Card.lazy").default
    render(<CardLazy />)
    expect(screen.getByTestId("lazy-wrapper")).toHaveAttribute(
      "data-interactive",
      "false",
    )
  })
})
