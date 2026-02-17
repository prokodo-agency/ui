import { render, screen } from "@testing-library/react"

import { CheckboxGroupView } from "./CheckboxGroup.view"

jest.mock("@/components/checkbox", () => ({
  Checkbox: ({
    title,
    onChange,
    required,
    showRequiredMark,
  }: {
    title: string
    onChange?: (e: unknown, checked: boolean) => void
    required?: boolean
    showRequiredMark?: boolean
  }) => (
    <button
      data-required={String(required)}
      data-show-required={String(showRequiredMark)}
      data-testid={`checkbox-${title}`}
      onClick={() => onChange?.({}, true)}
    >
      {title}
    </button>
  ),
}))

describe("CheckboxGroupView", () => {
  it("renders legend and hidden input", () => {
    render(
      <CheckboxGroupView
        hiddenInputName="rolesHidden"
        isChecked={() => true}
        legend="Choose roles"
        name="roles"
        options={[{ value: "buyer", title: "Buyer" }]}
        selectedValues={["buyer"]}
      />,
    )

    expect(screen.getByText("Choose roles")).toBeInTheDocument()
    expect(screen.queryByText("*")).not.toBeInTheDocument()
    expect(screen.getByDisplayValue("buyer")).toBeInTheDocument()
  })

  it("shows required marker on legend when group is required", () => {
    render(
      <CheckboxGroupView
        required
        isChecked={() => false}
        legend="Choose roles"
        name="roles"
        options={[{ value: "buyer", title: "Buyer" }]}
        selectedValues={[]}
      />,
    )

    expect(screen.getByText("*")).toBeInTheDocument()
  })

  it("wires option toggles", () => {
    const onToggle = jest.fn()

    render(
      <CheckboxGroupView
        isChecked={() => false}
        name="roles"
        selectedValues={[]}
        options={[
          { value: "buyer", title: "Buyer" },
          { value: "developer", title: "Developer" },
        ]}
        onToggle={onToggle}
      />,
    )

    screen.getByTestId("checkbox-Buyer").click()
    expect(onToggle).toHaveBeenCalledWith("buyer")
  })

  it("returns null for empty options", () => {
    const { container } = render(
      <CheckboxGroupView
        isChecked={() => false}
        name="roles"
        options={[]}
        selectedValues={[]}
      />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it("does not throw when onToggle is omitted", () => {
    render(
      <CheckboxGroupView
        isChecked={() => false}
        name="roles"
        options={[{ value: "buyer", title: "Buyer" }]}
        selectedValues={[]}
      />,
    )

    expect(() => screen.getByTestId("checkbox-Buyer").click()).not.toThrow()
  })

  it("applies required only while group is empty", () => {
    const { rerender } = render(
      <CheckboxGroupView
        required
        isChecked={() => false}
        name="roles"
        options={[{ value: "buyer", title: "Buyer" }]}
        selectedValues={[]}
      />,
    )

    expect(screen.getByTestId("checkbox-Buyer")).toHaveAttribute(
      "data-required",
      "true",
    )
    expect(screen.getByTestId("checkbox-Buyer")).toHaveAttribute(
      "data-show-required",
      "false",
    )

    rerender(
      <CheckboxGroupView
        required
        isChecked={() => true}
        name="roles"
        options={[{ value: "buyer", title: "Buyer" }]}
        selectedValues={["buyer"]}
      />,
    )

    expect(screen.getByTestId("checkbox-Buyer")).toHaveAttribute(
      "data-required",
      "false",
    )
  })

  it("shows required marker on checkbox label when option is required", () => {
    render(
      <CheckboxGroupView
        isChecked={() => false}
        name="roles"
        options={[{ value: "buyer", title: "Buyer", required: true }]}
        selectedValues={[]}
      />,
    )

    expect(screen.getByTestId("checkbox-Buyer")).toHaveAttribute(
      "data-show-required",
      "true",
    )
  })
})
