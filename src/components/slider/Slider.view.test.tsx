import { render } from "@/tests"

import { SliderView } from "./Slider.view"

const noop = () => {}

describe("SliderView", () => {
  it("renders with default min=0 and max=100 when those props are not provided", () => {
    const { container } = render(
      <SliderView
        id="test-slider"
        internalValue={50}
        isFocused={false}
        onBlurInternal={noop as never}
        onChangeInternal={noop as never}
        onFocusInternal={noop as never}
      />,
    )

    // eslint-disable-next-line testing-library/no-container
    const input = container.querySelector("input[type='range']")
    expect(input).not.toBeNull()
    // Default min=0, max=100 should be set via aria attributes
    expect(input?.getAttribute("aria-valuemin")).toBe("0")
    expect(input?.getAttribute("aria-valuemax")).toBe("100")
  })

  it("renders with provided min and max", () => {
    const { container } = render(
      <SliderView
        id="test-slider"
        internalValue={25}
        isFocused={false}
        max={50}
        min={10}
        onBlurInternal={noop as never}
        onChangeInternal={noop as never}
        onFocusInternal={noop as never}
      />,
    )

    // eslint-disable-next-line testing-library/no-container
    const input = container.querySelector("input[type='range']")
    expect(input?.getAttribute("aria-valuemin")).toBe("10")
    expect(input?.getAttribute("aria-valuemax")).toBe("50")
  })
})
