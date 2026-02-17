import { render, screen } from "@testing-library/react"

jest.mock("@/helpers/createLazyWrapper", () => ({
  createLazyWrapper: jest.fn(
    config =>
      function MockLazy(props: Record<string, unknown>) {
        return (
          <div data-name={config.name} data-testid="lazy-wrapper">
            {JSON.stringify(props)}
          </div>
        )
      },
  ),
}))

describe("Checkbox.lazy", () => {
  it("creates lazy wrapper for Checkbox", () => {
    const CheckboxLazy = require("./Checkbox.lazy").default

    render(<CheckboxLazy name="lazy" title="Lazy" value="v" />)

    expect(screen.getByTestId("lazy-wrapper")).toHaveAttribute(
      "data-name",
      "Checkbox",
    )
  })
})
