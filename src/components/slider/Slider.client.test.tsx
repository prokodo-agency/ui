import { act, render, screen } from "@/tests"

const mockView = jest.fn((props: Record<string, unknown>) => (
  <div
    data-focused={String(props.isFocused ?? false)}
    data-testid="slider-view"
    data-value={String(props.internalValue ?? 0)}
  >
    <button
      data-testid="trigger-change"
      onClick={() =>
        (props.onChangeInternal as (e: unknown) => void)?.({
          currentTarget: { value: "50" },
        } as never)
      }
    >
      change
    </button>
    <button
      data-testid="trigger-focus"
      onClick={() =>
        (props.onFocusInternal as (e: unknown) => void)?.({} as never)
      }
    >
      focus
    </button>
    <button
      data-testid="trigger-blur"
      onClick={() =>
        (props.onBlurInternal as (e: unknown) => void)?.({} as never)
      }
    >
      blur
    </button>
  </div>
))

jest.mock("./Slider.view", () => ({ SliderView: mockView }))

const SliderClient = require("./Slider.client").default

beforeEach(() => mockView.mockClear())

describe("Slider.client", () => {
  it("renders with initial value=0 by default", () => {
    render(<SliderClient />)
    expect(screen.getByTestId("slider-view")).toHaveAttribute("data-value", "0")
  })

  it("initializes with provided value", () => {
    render(<SliderClient value={30} />)
    expect(screen.getByTestId("slider-view")).toHaveAttribute(
      "data-value",
      "30",
    )
  })

  it("initializes with string value converted to number", () => {
    render(<SliderClient value={"40" as never} />)
    expect(screen.getByTestId("slider-view")).toHaveAttribute(
      "data-value",
      "40",
    )
  })

  it("clamps initial value to min/max", () => {
    render(<SliderClient max={100} min={0} value={200} />)
    expect(screen.getByTestId("slider-view")).toHaveAttribute(
      "data-value",
      "100",
    )
  })

  it("updates value on change", () => {
    render(<SliderClient />)
    act(() => {
      screen.getByTestId("trigger-change").click()
    })
    expect(screen.getByTestId("slider-view")).toHaveAttribute(
      "data-value",
      "50",
    )
  })

  it("calls onChange with new value", () => {
    const onChangeMock = jest.fn()
    render(<SliderClient onChange={onChangeMock} />)
    act(() => {
      screen.getByTestId("trigger-change").click()
    })
    expect(onChangeMock).toHaveBeenCalledWith(expect.any(Object), 50)
  })

  it("sets isFocused=true on focus", () => {
    render(<SliderClient />)
    act(() => {
      screen.getByTestId("trigger-focus").click()
    })
    expect(screen.getByTestId("slider-view")).toHaveAttribute(
      "data-focused",
      "true",
    )
  })

  it("sets isFocused=false on blur", () => {
    render(<SliderClient />)
    act(() => {
      screen.getByTestId("trigger-focus").click()
      screen.getByTestId("trigger-blur").click()
    })
    expect(screen.getByTestId("slider-view")).toHaveAttribute(
      "data-focused",
      "false",
    )
  })

  it("calls onFocus callback", () => {
    const onFocusMock = jest.fn()
    render(<SliderClient onFocus={onFocusMock} />)
    act(() => {
      screen.getByTestId("trigger-focus").click()
    })
    expect(onFocusMock).toHaveBeenCalledTimes(1)
  })

  it("calls onBlur callback", () => {
    const onBlurMock = jest.fn()
    render(<SliderClient onBlur={onBlurMock} />)
    act(() => {
      screen.getByTestId("trigger-focus").click()
      screen.getByTestId("trigger-blur").click()
    })
    expect(onBlurMock).toHaveBeenCalledTimes(1)
  })

  it("snaps to step when snap='step'", () => {
    render(<SliderClient max={100} min={0} snap="step" step={10} value={0} />)
    // initial value=0, step=10, should start at 0
    expect(screen.getByTestId("slider-view")).toHaveAttribute("data-value", "0")
  })

  it("snaps to marks when snap='marks' and marks are provided", () => {
    render(
      <SliderClient
        max={100}
        min={0}
        snap="marks"
        value={25}
        marks={
          [{ value: 0 }, { value: 25 }, { value: 50 }, { value: 100 }] as never
        }
      />,
    )
    expect(screen.getByTestId("slider-view")).toHaveAttribute(
      "data-value",
      "25",
    )
  })

  it("syncs with controlled value change", () => {
    const { rerender } = render(<SliderClient value={10} />)
    expect(screen.getByTestId("slider-view")).toHaveAttribute(
      "data-value",
      "10",
    )
    rerender(<SliderClient value={75} />)
    expect(screen.getByTestId("slider-view")).toHaveAttribute(
      "data-value",
      "75",
    )
  })

  it("generates marks from step when marks=true", () => {
    render(
      <SliderClient
        marks={true}
        max={20}
        min={0}
        snap="marks"
        step={10}
        value={0}
      />,
    )
    // The marks should be [0, 10, 20] — value=0 nearest to 0
    expect(screen.getByTestId("slider-view")).toHaveAttribute("data-value", "0")
  })

  it("syncs with string controlled value on rerender", () => {
    const { rerender } = render(<SliderClient value={10} />)
    expect(screen.getByTestId("slider-view")).toHaveAttribute(
      "data-value",
      "10",
    )
    rerender(<SliderClient value={"75" as never} />)
    expect(screen.getByTestId("slider-view")).toHaveAttribute(
      "data-value",
      "75",
    )
  })
})
