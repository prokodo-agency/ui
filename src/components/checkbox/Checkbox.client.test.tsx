import { fireEvent, render, screen } from "@testing-library/react"

import CheckboxClient from "./Checkbox.client"

jest.mock("./Checkbox.view", () => ({
  CheckboxView: ({
    isChecked,
    onChangeInternal,
    title,
  }: {
    isChecked: boolean
    onChangeInternal?: (e: { target: { checked: boolean } }) => void
    title: string
  }) => (
    <div data-checked={isChecked} data-testid="checkbox-view">
      <span>{title}</span>
      <button
        data-testid="toggle"
        onClick={() => onChangeInternal?.({ target: { checked: !isChecked } })}
      >
        toggle
      </button>
    </div>
  ),
}))

describe("CheckboxClient", () => {
  it("defaults to false when checked props are missing", () => {
    render(<CheckboxClient name="c0" title="Default false" value="v" />)

    expect(screen.getByTestId("checkbox-view")).toHaveAttribute(
      "data-checked",
      "false",
    )
  })

  it("handles uncontrolled state updates", () => {
    const onChange = jest.fn()

    render(
      <CheckboxClient
        defaultChecked={false}
        name="c1"
        title="Uncontrolled"
        value="v"
        onChange={onChange}
      />,
    )

    const view = screen.getByTestId("checkbox-view")
    expect(view).toHaveAttribute("data-checked", "false")

    fireEvent.click(screen.getByTestId("toggle"))

    expect(onChange).toHaveBeenCalledWith(expect.any(Object), true)
    expect(view).toHaveAttribute("data-checked", "true")
  })

  it("syncs controlled checked value", () => {
    const { rerender } = render(
      <CheckboxClient checked={true} name="c2" title="Controlled" value="v" />,
    )

    expect(screen.getByTestId("checkbox-view")).toHaveAttribute(
      "data-checked",
      "true",
    )

    rerender(
      <CheckboxClient checked={false} name="c2" title="Controlled" value="v" />,
    )

    expect(screen.getByTestId("checkbox-view")).toHaveAttribute(
      "data-checked",
      "false",
    )

    fireEvent.click(screen.getByTestId("toggle"))
    expect(screen.getByTestId("checkbox-view")).toHaveAttribute(
      "data-checked",
      "false",
    )
  })
})
