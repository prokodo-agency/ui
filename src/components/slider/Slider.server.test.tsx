import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import SliderServer from "./Slider.server"

let capturedSliderProps: Record<string, unknown> = {}

jest.mock("./Slider.view", () => ({
  SliderView: (props: Record<string, unknown>) => {
    capturedSliderProps = props
    return (
      <div
        data-focused={String(props.isFocused)}
        data-testid="view"
        data-value={props.internalValue as number}
      />
    )
  },
}))

describe("SliderServer", () => {
  it("renders with required id prop", () => {
    render(<SliderServer id="slider-1" />)
    expect(screen.getByTestId("view")).toBeInTheDocument()
  })

  it("forces isFocused=false", () => {
    render(<SliderServer id="slider-1" />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-focused", "false")
  })

  it("uses numeric value directly", () => {
    render(<SliderServer id="slider-1" value={42} />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-value", "42")
  })

  it("converts string value to number", () => {
    render(<SliderServer id="slider-1" value={"30" as unknown as number} />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-value", "30")
  })

  it("defaults to min (0) when value is undefined", () => {
    render(<SliderServer id="slider-1" />)
    expect(screen.getByTestId("view")).toHaveAttribute("data-value", "0")
  })

  it("onBlurInternal, onChangeInternal, onFocusInternal are no-ops", () => {
    render(<SliderServer id="slider-1" />)
    expect(
      (capturedSliderProps.onBlurInternal as () => unknown)(),
    ).toBeUndefined()
    expect(
      (capturedSliderProps.onChangeInternal as () => unknown)(),
    ).toBeUndefined()
    expect(
      (capturedSliderProps.onFocusInternal as () => unknown)(),
    ).toBeUndefined()
  })
})
