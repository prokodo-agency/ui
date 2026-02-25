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

describe("Rating.lazy", () => {
  it("creates lazy wrapper with name 'Rating'", () => {
    const RatingLazy = require("./Rating.lazy").default
    render(<RatingLazy />)
    const wrapper = screen.getByTestId("lazy-wrapper")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveAttribute("data-name", "Rating")
    expect(wrapper).toHaveAttribute("data-interactive", "false")
  })
})
