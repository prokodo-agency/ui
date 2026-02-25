import { render, screen } from "@/tests"

import { DynamicListView } from "./DynamicList.view"

const singleTextField = [{ fieldType: "input" as const, name: "email" }]

describe("DynamicListView", () => {
  it("renders without value or name (uses defaults value=[] and name='items')", () => {
    // Neither 'value' nor 'name' is provided → default branches are covered
    render(
      <DynamicListView
        fields={singleTextField}
        id="test-dynamic-list"
        label="Test List"
      />,
    )

    // Fieldset should be rendered (aria-labelledby uses default name="items")
    expect(screen.getByRole("group")).toBeInTheDocument()

    // The add button should always be rendered
    expect(screen.getByTitle("Add item")).toBeInTheDocument()
  })

  it("renders correctly when value is provided explicitly", () => {
    render(
      <DynamicListView
        fields={singleTextField}
        id="test-dynamic-list"
        label="Entries"
        name="entries"
        value={["test@example.com"]}
      />,
    )

    // One item row should be rendered
    expect(screen.getByRole("list")).toBeInTheDocument()
  })
})
