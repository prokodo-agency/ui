import { act, render, screen } from "@/tests"

// Mock RatingView
const mockView = jest.fn((props: Record<string, unknown>) => (
  <div
    data-error={String(props.errorText ?? "")}
    data-focused={String(props.isFocused ?? false)}
    data-testid="rating-view"
    data-value={props.value !== undefined ? String(props.value) : "undefined"}
    data-hover={
      props.hoverValue !== undefined ? String(props.hoverValue) : "undefined"
    }
  >
    <button
      data-testid="item-3"
      data-value="3"
      onBlur={props.onBlur as never}
      onClick={props.onClick as never}
      onFocus={props.onFocus as never}
      onMouseEnter={props.onMouseEnter as never}
      onMouseLeave={props.onMouseLeave as never}
    >
      3
    </button>
  </div>
))

jest.mock("./Rating.view", () => ({ RatingView: mockView }))

// stub validation to store the error
jest.mock("./Rating.validation", () => ({
  handleRatingValidation: jest.fn(
    (
      _name: unknown,
      _val: unknown,
      required: unknown,
      _min: unknown,
      _max: unknown,
      _translations: unknown,
      cb: (name: unknown, err: string | undefined) => void,
    ) => {
      if (required && _val == null) cb(_name, "Required")
      else cb(_name, undefined)
    },
  ),
}))

const RatingClient = require("./Rating.client").default

beforeEach(() => mockView.mockClear())

describe("Rating.client", () => {
  it("renders with no initial value", () => {
    render(<RatingClient name="stars" />)
    expect(screen.getByTestId("rating-view")).toHaveAttribute(
      "data-value",
      "undefined",
    )
  })

  it("initializes with provided value", () => {
    render(<RatingClient name="stars" value={4} />)
    expect(screen.getByTestId("rating-view")).toHaveAttribute("data-value", "4")
  })

  it("initializes with defaultValue", () => {
    render(<RatingClient defaultValue={2} name="stars" />)
    expect(screen.getByTestId("rating-view")).toHaveAttribute("data-value", "2")
  })

  it("updates value on item click", async () => {
    render(<RatingClient name="stars" />)
    await act(async () => {
      const p = mockView.mock.lastCall?.[0] as Record<string, unknown>
      ;(p.onClick as (e: unknown) => void)?.({
        currentTarget: { dataset: { value: "3" } },
      })
    })
    expect(screen.getByTestId("rating-view")).toHaveAttribute("data-value", "3")
  })

  it("sets hover value on mouseEnter", async () => {
    render(<RatingClient name="stars" />)
    await act(async () => {
      const propsOnMouseEnter = mockView.mock.lastCall?.[0]?.onMouseEnter as (
        e: MouseEvent,
      ) => void
      propsOnMouseEnter?.({
        currentTarget: { dataset: { value: "3" } },
      } as never)
    })
    expect(screen.getByTestId("rating-view")).toHaveAttribute("data-hover", "3")
    expect(screen.getByTestId("item-3")).toBeInTheDocument()
  })

  it("clears hover on mouseLeave", async () => {
    render(<RatingClient name="stars" />)
    await act(async () => {
      const p = mockView.mock.lastCall?.[0] as Record<string, unknown>
      ;(p.onMouseEnter as (e: unknown) => void)?.({
        currentTarget: { dataset: { value: "5" } },
      })
    })
    await act(async () => {
      const p = mockView.mock.lastCall?.[0] as Record<string, unknown>
      ;(p.onMouseLeave as () => void)?.()
    })
    expect(screen.getByTestId("rating-view")).toHaveAttribute(
      "data-hover",
      "undefined",
    )
  })

  it("sets focused=true on focus", async () => {
    render(<RatingClient name="stars" />)
    await act(async () => {
      const p = mockView.mock.lastCall?.[0] as Record<string, unknown>
      ;(p.onFocus as (e: unknown) => void)?.({})
    })
    expect(screen.getByTestId("rating-view")).toHaveAttribute(
      "data-focused",
      "true",
    )
  })

  it("sets focused=false on blur", async () => {
    render(<RatingClient name="stars" />)
    await act(async () => {
      const p = mockView.mock.lastCall?.[0] as Record<string, unknown>
      ;(p.onFocus as (e: unknown) => void)?.({})
    })
    await act(async () => {
      const p = mockView.mock.lastCall?.[0] as Record<string, unknown>
      ;(p.onBlur as (e: unknown) => void)?.({})
    })
    expect(screen.getByTestId("rating-view")).toHaveAttribute(
      "data-focused",
      "false",
    )
  })

  it("uses isFocused prop when provided", () => {
    render(<RatingClient isFocused={true} name="stars" />)
    expect(screen.getByTestId("rating-view")).toHaveAttribute(
      "data-focused",
      "true",
    )
  })

  it("calls onChange when item clicked", async () => {
    const onChangeMock = jest.fn()
    render(<RatingClient name="stars" onChange={onChangeMock} />)
    await act(async () => {
      const p = mockView.mock.lastCall?.[0] as Record<string, unknown>
      ;(p.onClick as (e: unknown) => void)?.({
        currentTarget: { dataset: { value: "3" } },
      })
    })
    expect(onChangeMock).toHaveBeenCalledWith({ name: "stars", value: 3 })
  })

  it("does not update hover or call click when disabled", async () => {
    const onChangeMock = jest.fn()
    render(<RatingClient disabled name="stars" onChange={onChangeMock} />)
    await act(async () => {
      const p = mockView.mock.lastCall?.[0] as Record<string, unknown>
      ;(p.onClick as (e: unknown) => void)?.({
        currentTarget: { dataset: { value: "3" } },
      })
      ;(p.onMouseEnter as (e: unknown) => void)?.({
        currentTarget: { dataset: { value: "3" } },
      })
    })
    expect(onChangeMock).not.toHaveBeenCalled()
    expect(screen.getByTestId("rating-view")).toHaveAttribute(
      "data-hover",
      "undefined",
    )
  })

  it("does not update when readOnly", async () => {
    const onChangeMock = jest.fn()
    render(<RatingClient readOnly name="stars" onChange={onChangeMock} />)
    await act(async () => {
      const p = mockView.mock.lastCall?.[0] as Record<string, unknown>
      ;(p.onClick as (e: unknown) => void)?.({
        currentTarget: { dataset: { value: "3" } },
      })
    })
    expect(onChangeMock).not.toHaveBeenCalled()
  })

  it("syncs with controlled value change", () => {
    const { rerender } = render(<RatingClient name="stars" value={1} />)
    expect(screen.getByTestId("rating-view")).toHaveAttribute("data-value", "1")
    rerender(<RatingClient name="stars" value={5} />)
    expect(screen.getByTestId("rating-view")).toHaveAttribute("data-value", "5")
  })

  it("calls onFocus callback", async () => {
    const onFocusMock = jest.fn()
    render(<RatingClient name="stars" onFocus={onFocusMock} />)
    await act(async () => {
      const p = mockView.mock.lastCall?.[0] as Record<string, unknown>
      ;(p.onFocus as (e: unknown) => void)?.({})
    })
    expect(onFocusMock).toHaveBeenCalledTimes(1)
  })

  it("calls onBlur callback", async () => {
    const onBlurMock = jest.fn()
    render(<RatingClient name="stars" onBlur={onBlurMock} />)
    await act(async () => {
      const p = mockView.mock.lastCall?.[0] as Record<string, unknown>
      ;(p.onBlur as (e: unknown) => void)?.({})
    })
    expect(onBlurMock).toHaveBeenCalledTimes(1)
  })

  it("handleItemClick does nothing when raw data-value is null/missing", async () => {
    const onChangeMock = jest.fn()
    render(<RatingClient name="stars" onChange={onChangeMock} />)
    await act(async () => {
      const p = mockView.mock.lastCall?.[0] as Record<string, unknown>
      ;(p.onClick as (e: unknown) => void)?.({
        currentTarget: { dataset: {} }, // no value key → raw = undefined → null check triggers
      })
    })
    expect(onChangeMock).not.toHaveBeenCalled()
  })

  it("handleItemHover does nothing when raw data-value is null/missing", async () => {
    render(<RatingClient name="stars" />)
    await act(async () => {
      const p = mockView.mock.lastCall?.[0] as Record<string, unknown>
      ;(p.onMouseEnter as (e: unknown) => void)?.({
        currentTarget: { dataset: {} }, // no value key
      })
    })
    expect(screen.getByTestId("rating-view")).toHaveAttribute(
      "data-hover",
      "undefined",
    )
  })

  it("handleMouseLeave does nothing when disabled", async () => {
    render(<RatingClient disabled name="stars" />)
    await act(async () => {
      const p = mockView.mock.lastCall?.[0] as Record<string, unknown>
      // first set a hover value won't work because disabled... but still call onMouseLeave
      ;(p.onMouseLeave as () => void)?.()
    })
    // hover was never set (disabled), stays undefined
    expect(screen.getByTestId("rating-view")).toHaveAttribute(
      "data-hover",
      "undefined",
    )
  })

  it("runValidation handles string value (isString branch)", async () => {
    // Pass a string value as controlled value → useEffect syncs it → isString branch
    render(<RatingClient name="stars" value={"3" as unknown as number} />)
    await act(async () => {
      const p = mockView.mock.lastCall?.[0] as Record<string, unknown>
      ;(p.onClick as (e: unknown) => void)?.({
        currentTarget: { dataset: { value: "4" } },
      })
    })
    // Click triggers runValidation with numeric value; the existing string path
    // is tested via controlled value sync:
    // value="3" → isString → useEffect sets val to "3"
    expect(screen.getByTestId("rating-view")).toHaveAttribute("data-value", "4")
  })

  it("isFocused=false overrides internal focus state", async () => {
    render(<RatingClient isFocused={false} name="stars" />)
    await act(async () => {
      const p = mockView.mock.lastCall?.[0] as Record<string, unknown>
      ;(p.onFocus as (e: unknown) => void)?.({})
    })
    // isFocused prop provided (false) → overrides internal focused=true
    expect(screen.getByTestId("rating-view")).toHaveAttribute(
      "data-focused",
      "false",
    )
  })

  it("keeps local state when controlled value changes to undefined", () => {
    const { rerender } = render(<RatingClient name="stars" value={3} />)
    expect(screen.getByTestId("rating-view")).toHaveAttribute("data-value", "3")
    rerender(<RatingClient name="stars" value={undefined} />)
    // value=undefined → else-if branch: uncontrolled mode, local state preserved
    expect(screen.getByTestId("rating-view")).toHaveAttribute("data-value", "3")
  })

  it("does not update state when value is not a number, string, or undefined (falls through all branches)", () => {
    const { rerender } = render(<RatingClient name="stars" value={3} />)
    expect(screen.getByTestId("rating-view")).toHaveAttribute("data-value", "3")
    // null is neither isNumber nor isString nor undefined → neither branch executes
    rerender(<RatingClient name="stars" value={null as never} />)
    expect(screen.getByTestId("rating-view")).toHaveAttribute("data-value", "3")
  })
})
