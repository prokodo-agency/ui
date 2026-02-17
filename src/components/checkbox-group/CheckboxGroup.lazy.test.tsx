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

describe("CheckboxGroup.lazy", () => {
  it("creates lazy wrapper for CheckboxGroup", () => {
    const CheckboxGroupLazy = require("./CheckboxGroup.lazy").default

    render(<CheckboxGroupLazy name="lazy" options={[]} />)

    expect(screen.getByTestId("lazy-wrapper")).toHaveAttribute(
      "data-name",
      "CheckboxGroup",
    )
  })
})
