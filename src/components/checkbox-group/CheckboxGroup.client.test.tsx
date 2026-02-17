import { fireEvent, render, screen } from "@testing-library/react"

import CheckboxGroupClient from "./CheckboxGroup.client"

jest.mock("./CheckboxGroup.view", () => ({
  CheckboxGroupView: ({
    selectedValues,
    onToggle,
    isChecked,
  }: {
    selectedValues: string[]
    onToggle?: (v: string) => void
    isChecked?: (v: string) => boolean
  }) => (
    <div
      data-is-a-checked={String(isChecked?.("a"))}
      data-testid="group-view"
      data-values={selectedValues.join(",")}
    >
      <button data-testid="toggle-a" onClick={() => onToggle?.("a")}>
        toggle a
      </button>
      <button data-testid="toggle-b" onClick={() => onToggle?.("b")}>
        toggle b
      </button>
    </div>
  ),
}))

describe("CheckboxGroupClient", () => {
  it("initializes empty when values are not provided", () => {
    render(
      <CheckboxGroupClient name="g0" options={[{ value: "a", title: "A" }]} />,
    )

    expect(screen.getByTestId("group-view")).toHaveAttribute("data-values", "")
  })

  it("handles uncontrolled toggling and emits onChange", () => {
    const onChange = jest.fn()

    render(
      <CheckboxGroupClient
        defaultValues={["a"]}
        name="g1"
        options={[
          { value: "a", title: "A" },
          { value: "b", title: "B" },
        ]}
        onChange={onChange}
      />,
    )

    expect(screen.getByTestId("group-view")).toHaveAttribute("data-values", "a")
    expect(screen.getByTestId("group-view")).toHaveAttribute(
      "data-is-a-checked",
      "true",
    )

    fireEvent.click(screen.getByTestId("toggle-b"))
    expect(onChange).toHaveBeenLastCalledWith(["a", "b"])

    fireEvent.click(screen.getByTestId("toggle-a"))
    expect(onChange).toHaveBeenLastCalledWith(["b"])
  })

  it("syncs controlled values", () => {
    const { rerender } = render(
      <CheckboxGroupClient
        name="g2"
        values={["a"]}
        options={[
          { value: "a", title: "A" },
          { value: "b", title: "B" },
        ]}
      />,
    )

    expect(screen.getByTestId("group-view")).toHaveAttribute("data-values", "a")

    rerender(
      <CheckboxGroupClient
        name="g2"
        values={["a", "b"]}
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

  it("does not crash when onChange is not provided", () => {
    render(
      <CheckboxGroupClient
        defaultValues={["a"]}
        name="g3"
        options={[
          { value: "a", title: "A" },
          { value: "b", title: "B" },
        ]}
      />,
    )

    fireEvent.click(screen.getByTestId("toggle-b"))
    expect(screen.getByTestId("group-view")).toBeInTheDocument()
  })
})
