import { fireEvent, render, screen } from "@testing-library/react"

import { CheckboxView } from "./Checkbox.view"

describe("CheckboxView", () => {
  it("renders title, description and right icon", () => {
    render(
      <CheckboxView
        description="Open-source friendly"
        icon={{ name: "Tick01Icon", size: "sm" }}
        iconLabel="Recommended option"
        isChecked={true}
        name="license"
        title="MIT"
        value="mit"
      />,
    )

    expect(screen.getByText("MIT")).toBeInTheDocument()
    expect(screen.getByText("Open-source friendly")).toBeInTheDocument()
    expect(
      screen.getByRole("img", { name: /recommended option/i }),
    ).toBeInTheDocument()
  })

  it("forwards checkbox change", () => {
    const onChangeInternal = jest.fn()

    render(
      <CheckboxView
        isChecked={false}
        name="newsletter"
        title="Newsletter"
        value="yes"
        onChangeInternal={onChangeInternal}
      />,
    )

    fireEvent.click(screen.getByRole("checkbox", { name: /newsletter/i }))
    expect(onChangeInternal).toHaveBeenCalledTimes(1)
  })

  it("shows required marker when required is true", () => {
    render(
      <CheckboxView
        required
        isChecked={false}
        name="required"
        title="Required field"
        value="yes"
      />,
    )

    expect(screen.getByText("*")).toBeInTheDocument()
  })

  it("hides required marker when showRequiredMark is false", () => {
    render(
      <CheckboxView
        required
        isChecked={false}
        name="required-hidden"
        showRequiredMark={false}
        title="Required hidden"
        value="yes"
      />,
    )

    expect(screen.queryByText("*")).not.toBeInTheDocument()
  })

  it("renders icon without name prop (icon.name falsy branch)", () => {
    render(
      <CheckboxView
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        icon={{} as any}
        isChecked={false}
        name="icon-no-name"
        title="Icon no name"
        value="yes"
      />,
    )
    // icon.name is undefined so Icon is not rendered
    expect(screen.queryByRole("img")).not.toBeInTheDocument()
  })
})
