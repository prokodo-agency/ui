import { render, screen } from "@testing-library/react"

import CheckboxGroupServer from "./CheckboxGroup.server"

jest.mock("./CheckboxGroup.view", () => ({
  CheckboxGroupView: ({ selectedValues }: { selectedValues: string[] }) => (
    <div data-testid="group-view" data-values={selectedValues.join(",")} />
  ),
}))

describe("CheckboxGroupServer", () => {
  it("uses controlled values when provided", () => {
    render(
      <CheckboxGroupServer
        name="srv"
        values={["a", "a", "b"]}
        options={[
          { value: "a", title: "A" },
          { value: "b", title: "B" },
        ]}
      />,
    )

    expect(screen.getByTestId("group-view")).toHaveAttribute(
      "data-values",
      "a,b",
    )
  })

  it("falls back to defaultValues", () => {
    render(
      <CheckboxGroupServer
        defaultValues={["b"]}
        name="srv2"
        options={[{ value: "b", title: "B" }]}
      />,
    )

    expect(screen.getByTestId("group-view")).toHaveAttribute("data-values", "b")
  })
})
