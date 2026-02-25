import { act, render, screen } from "@/tests"

const mockView = jest.fn((props: Record<string, unknown>) => (
  <div
    data-error={String(props.errorText ?? "")}
    data-focused={String(props.isFocused ?? false)}
    data-testid="input-view"
    data-value={String(props.value ?? "")}
  >
    <button
      data-testid="trigger-change"
      onClick={() =>
        (props.onChange as (e: unknown) => void)?.({
          target: { value: "hello" },
        } as never)
      }
    >
      change
    </button>
    <button
      data-testid="trigger-focus"
      onClick={() => (props.onFocus as (e: unknown) => void)?.({} as never)}
    >
      focus
    </button>
    <button
      data-testid="trigger-blur"
      onClick={() => (props.onBlur as (e: unknown) => void)?.({} as never)}
    >
      blur
    </button>
  </div>
))

jest.mock("./Input.view", () => ({ InputView: mockView }))

const InputClient = require("./Input.client").default

beforeEach(() => mockView.mockClear())

describe("Input.client", () => {
  it("renders with empty value by default", () => {
    render(<InputClient name="test" />)
    expect(screen.getByTestId("input-view")).toHaveAttribute("data-value", "")
  })

  it("initializes with provided value", () => {
    render(<InputClient name="test" value="init" />)
    expect(screen.getByTestId("input-view")).toHaveAttribute(
      "data-value",
      "init",
    )
  })

  it("updates value on change event", () => {
    render(<InputClient name="test" />)
    act(() => {
      screen.getByTestId("trigger-change").click()
    })
    expect(screen.getByTestId("input-view")).toHaveAttribute(
      "data-value",
      "hello",
    )
  })

  it("calls onChange callback", () => {
    const onChangeMock = jest.fn()
    render(<InputClient name="test" onChange={onChangeMock} />)
    act(() => {
      screen.getByTestId("trigger-change").click()
    })
    expect(onChangeMock).toHaveBeenCalledTimes(1)
  })

  it("sets isFocused=true on focus", () => {
    render(<InputClient name="test" />)
    act(() => {
      screen.getByTestId("trigger-focus").click()
    })
    expect(screen.getByTestId("input-view")).toHaveAttribute(
      "data-focused",
      "true",
    )
  })

  it("sets isFocused=false on blur", () => {
    render(<InputClient name="test" />)
    act(() => {
      screen.getByTestId("trigger-focus").click()
      screen.getByTestId("trigger-blur").click()
    })
    expect(screen.getByTestId("input-view")).toHaveAttribute(
      "data-focused",
      "false",
    )
  })

  it("calls onFocus callback", () => {
    const onFocusMock = jest.fn()
    render(<InputClient name="test" onFocus={onFocusMock} />)
    act(() => {
      screen.getByTestId("trigger-focus").click()
    })
    expect(onFocusMock).toHaveBeenCalledTimes(1)
  })

  it("calls onBlur callback", () => {
    const onBlurMock = jest.fn()
    render(<InputClient name="test" onBlur={onBlurMock} />)
    act(() => {
      screen.getByTestId("trigger-blur").click()
    })
    expect(onBlurMock).toHaveBeenCalledTimes(1)
  })

  it("uses external isFocused prop when provided", () => {
    render(<InputClient isFocused={true} name="test" />)
    expect(screen.getByTestId("input-view")).toHaveAttribute(
      "data-focused",
      "true",
    )
  })

  it("passes multiline=true through to view", () => {
    render(<InputClient multiline name="test" />)
    const lastProps = mockView.mock.lastCall?.[0] as Record<string, unknown>
    expect(lastProps.multiline).toBe(true)
  })

  it("syncs with controlled value change", () => {
    const { rerender } = render(<InputClient name="test" value="old" />)
    expect(screen.getByTestId("input-view")).toHaveAttribute(
      "data-value",
      "old",
    )
    rerender(<InputClient name="test" value="new" />)
    expect(screen.getByTestId("input-view")).toHaveAttribute(
      "data-value",
      "new",
    )
  })

  it("does not update when value is null", () => {
    render(<InputClient name="test" value={null as never} />)
    // null is filtered by isNull check — keeps previous state
    expect(screen.getByTestId("input-view")).toHaveAttribute("data-value", "")
  })

  it("initializes error from errorText prop", () => {
    render(<InputClient errorText="Required" name="test" />)
    expect(screen.getByTestId("input-view")).toHaveAttribute(
      "data-error",
      "Required",
    )
  })
})
