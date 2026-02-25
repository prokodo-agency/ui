import { fireEvent, render, screen } from "@/tests"

const mockView = jest.fn(
  (props: {
    isChecked?: boolean
    isFocused?: boolean
    onChangeInternal?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onFocusInternal?: (e: React.FocusEvent<HTMLInputElement>) => void
    onBlurInternal?: (e: React.FocusEvent<HTMLInputElement>) => void
  }) => (
    <div
      data-checked={String(props.isChecked ?? false)}
      data-focused={String(props.isFocused ?? false)}
      data-testid="switch-view"
    >
      <button
        data-testid="trigger-change"
        onClick={() =>
          props.onChangeInternal?.({
            target: { checked: !props.isChecked },
          } as React.ChangeEvent<HTMLInputElement>)
        }
      >
        change
      </button>
      <button
        data-testid="trigger-focus"
        onClick={() =>
          props.onFocusInternal?.({} as React.FocusEvent<HTMLInputElement>)
        }
      >
        focus
      </button>
      <button
        data-testid="trigger-blur"
        onClick={() =>
          props.onBlurInternal?.({} as React.FocusEvent<HTMLInputElement>)
        }
      >
        blur
      </button>
    </div>
  ),
)

jest.mock("./Switch.view", () => ({ SwitchView: mockView }))

const SwitchClient = require("./Switch.client").default

beforeEach(() => mockView.mockClear())

describe("Switch.client", () => {
  it("starts as unchecked when no checked prop provided", () => {
    render(<SwitchClient />)
    expect(screen.getByTestId("switch-view")).toHaveAttribute(
      "data-checked",
      "false",
    )
  })

  it("initializes with provided checked value", () => {
    render(<SwitchClient checked={true} />)
    expect(screen.getByTestId("switch-view")).toHaveAttribute(
      "data-checked",
      "true",
    )
  })

  it("updates state on change event", () => {
    render(<SwitchClient checked={false} />)
    fireEvent.click(screen.getByTestId("trigger-change"))
    expect(screen.getByTestId("switch-view")).toHaveAttribute(
      "data-checked",
      "true",
    )
  })

  it("calls onChange callback with new value", () => {
    const onChangeMock = jest.fn()
    render(<SwitchClient onChange={onChangeMock} />)
    fireEvent.click(screen.getByTestId("trigger-change"))
    expect(onChangeMock).toHaveBeenCalledWith(expect.any(Object), true)
  })

  it("syncs with controlled checked prop change", () => {
    const { rerender } = render(<SwitchClient checked={false} />)
    expect(screen.getByTestId("switch-view")).toHaveAttribute(
      "data-checked",
      "false",
    )

    rerender(<SwitchClient checked={true} />)
    expect(screen.getByTestId("switch-view")).toHaveAttribute(
      "data-checked",
      "true",
    )
  })

  it("sets isFocused=true on focus", () => {
    render(<SwitchClient />)
    fireEvent.click(screen.getByTestId("trigger-focus"))
    expect(screen.getByTestId("switch-view")).toHaveAttribute(
      "data-focused",
      "true",
    )
  })

  it("sets isFocused=false on blur", () => {
    render(<SwitchClient />)
    fireEvent.click(screen.getByTestId("trigger-focus"))
    fireEvent.click(screen.getByTestId("trigger-blur"))
    expect(screen.getByTestId("switch-view")).toHaveAttribute(
      "data-focused",
      "false",
    )
  })

  it("calls onFocus callback", () => {
    const onFocusMock = jest.fn()
    render(<SwitchClient onFocus={onFocusMock} />)
    fireEvent.click(screen.getByTestId("trigger-focus"))
    expect(onFocusMock).toHaveBeenCalledTimes(1)
  })

  it("calls onBlur callback", () => {
    const onBlurMock = jest.fn()
    render(<SwitchClient onBlur={onBlurMock} />)
    fireEvent.click(screen.getByTestId("trigger-focus"))
    fireEvent.click(screen.getByTestId("trigger-blur"))
    expect(onBlurMock).toHaveBeenCalledTimes(1)
  })

  it("does not sync when controlledChecked is undefined", () => {
    const { rerender } = render(<SwitchClient />)
    // Internal state unchanged when controlledChecked stays undefined
    rerender(<SwitchClient />)
    expect(screen.getByTestId("switch-view")).toHaveAttribute(
      "data-checked",
      "false",
    )
  })
})
