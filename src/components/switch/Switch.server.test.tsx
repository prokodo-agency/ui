import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import SwitchServer from "./Switch.server"

let capturedSwitchProps: Record<string, unknown> = {}

jest.mock("./Switch.view", () => ({
  SwitchView: (props: Record<string, unknown>) => {
    capturedSwitchProps = props
    return (
      <div
        data-checked={String(props.isChecked)}
        data-focused={String(props.isFocused)}
        data-testid="view"
      />
    )
  },
}))

describe("SwitchServer", () => {
  it("renders with required name prop", () => {
    render(<SwitchServer name="toggle" />)
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })

  it("forces isFocused=false", () => {
    render(<SwitchServer name="toggle" />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-focused", "false")
  })

  it("uses controlled checked=true", () => {
    render(<SwitchServer checked={true} name="toggle" />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-checked", "true")
  })

  it("uses controlled checked=false", () => {
    render(<SwitchServer checked={false} name="toggle" />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-checked", "false")
  })

  it("defaults isChecked=false when checked is undefined", () => {
    render(<SwitchServer name="toggle" />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-checked", "false")
  })

  it("onBlurInternal, onChangeInternal, onFocusInternal are no-ops", () => {
    render(<SwitchServer name="toggle" />)
    expect(
      (capturedSwitchProps.onBlurInternal as () => unknown)(),
    ).toBeUndefined()
    expect(
      (capturedSwitchProps.onChangeInternal as () => unknown)(),
    ).toBeUndefined()
    expect(
      (capturedSwitchProps.onFocusInternal as () => unknown)(),
    ).toBeUndefined()
  })
})
