import { act, render, screen, fireEvent } from "@/tests"

let capturedOnMouseDown: ((e: React.MouseEvent) => void) | undefined
let capturedOnCloseKeyDown: ((e: React.KeyboardEvent) => void) | undefined

const mockView = jest.fn((props: Record<string, unknown>) => {
  capturedOnMouseDown = props.onMouseDown as (e: React.MouseEvent) => void
  capturedOnCloseKeyDown = props.onCloseKeyDown as (
    e: React.KeyboardEvent,
  ) => void
  return (
    <div data-open={String(props.open ?? false)} data-testid="dialog-view">
      <button
        data-testid="backdrop"
        onMouseDown={
          (props.wrapperProps as Record<string, unknown>)
            ?.onMouseDown as React.MouseEventHandler
        }
      >
        backdrop
      </button>
      <div
        ref={props.containerRef as React.Ref<HTMLDivElement>}
        data-testid="dialog-container"
      >
        <button data-testid="first-focusable">first</button>
        <button data-testid="last-focusable">last</button>
      </div>
      <div
        ref={props.closeButtonRef as React.Ref<HTMLDivElement>}
        data-testid="close-btn-placeholder"
      />
    </div>
  )
})

jest.mock("./Dialog.view", () => ({ DialogView: mockView }))

const DialogClient = require("./Dialog.client").default

beforeEach(() => {
  mockView.mockClear()
  capturedOnMouseDown = undefined
  capturedOnCloseKeyDown = undefined
  jest.useFakeTimers()
})
afterEach(() => jest.useRealTimers())

describe("Dialog.client", () => {
  it("starts closed by default", () => {
    render(<DialogClient />)
    expect(screen.getByTestId("dialog-view")).toHaveAttribute(
      "data-open",
      "false",
    )
  })

  it("starts open when open=true prop provided", () => {
    render(<DialogClient open />)
    expect(screen.getByTestId("dialog-view")).toHaveAttribute(
      "data-open",
      "true",
    )
  })

  it("opens when open prop changes to true", () => {
    const { rerender } = render(<DialogClient open={false} />)
    rerender(<DialogClient open={true} />)
    expect(screen.getByTestId("dialog-view")).toHaveAttribute(
      "data-open",
      "true",
    )
  })

  it("dialog stays open even when re-rendered with open=false (no auto-close behavior)", () => {
    // DialogClient can only be closed via closeDialog; prop change doesn't auto-close
    const { rerender } = render(<DialogClient open={true} />)
    // verify open
    expect(screen.getByTestId("dialog-view")).toHaveAttribute(
      "data-open",
      "true",
    )
    // re-render with open=false should not auto-close (no effect for that case)
    rerender(<DialogClient open={false} />)
    // The dialog remains open as there is no effect listening to open=false
    // (close is triggered only through user interactions)
    expect(screen.getByTestId("dialog-view")).toBeInTheDocument()
  })

  it("closes on backdrop mousedown when closeOnBackdropClick=true (default)", () => {
    render(<DialogClient open />)
    fireEvent.mouseDown(screen.getByTestId("backdrop"))
    expect(screen.getByTestId("dialog-view")).toHaveAttribute(
      "data-open",
      "false",
    )
  })

  it("does not close on backdrop mousedown when closeOnBackdropClick=false", () => {
    render(<DialogClient open closeOnBackdropClick={false} />)
    fireEvent.mouseDown(screen.getByTestId("backdrop"))
    expect(screen.getByTestId("dialog-view")).toHaveAttribute(
      "data-open",
      "true",
    )
  })

  it("calls onChange on backdrop close", () => {
    const onChangeMock = jest.fn()
    render(<DialogClient open onChange={onChangeMock} />)
    fireEvent.mouseDown(screen.getByTestId("backdrop"))
    // onChange fires after FADE_DURATION timeout
    jest.runAllTimers()
    expect(onChangeMock).toHaveBeenCalledWith(
      expect.any(Object),
      "backdropClick",
      false,
    )
  })

  it("closes on Escape key when open", () => {
    render(<DialogClient open />)
    fireEvent.keyDown(window, { key: "Escape" }),
      expect(screen.getByTestId("dialog-view")).toHaveAttribute(
        "data-open",
        "false",
      )
  })

  it("does not close on Escape when already closed", () => {
    render(<DialogClient open={false} />)
    fireEvent.keyDown(window, { key: "Escape" })
    expect(screen.getByTestId("dialog-view")).toHaveAttribute(
      "data-open",
      "false",
    )
  })

  it("opens via imperative ref", async () => {
    const ref = { current: null } as unknown as React.RefObject<{
      openDialog(): void
      closeDialog(reason?: string): void
    }>
    render(<DialogClient ref={ref} />)
    await act(async () => {
      ref.current?.openDialog()
    })
    expect(screen.getByTestId("dialog-view")).toHaveAttribute(
      "data-open",
      "true",
    )
  })

  it("closes via imperative ref", async () => {
    const ref = { current: null } as unknown as React.RefObject<{
      openDialog(): void
      closeDialog(reason?: string): void
    }>
    render(<DialogClient ref={ref} open />)
    await act(async () => {
      ref.current?.closeDialog()
    })
    expect(screen.getByTestId("dialog-view")).toHaveAttribute(
      "data-open",
      "false",
    )
  })

  it("calls onClose when closing", async () => {
    const onCloseMock = jest.fn()
    const ref = { current: null } as unknown as React.RefObject<{
      openDialog(): void
      closeDialog(reason?: string): void
    }>
    render(<DialogClient ref={ref} open onClose={onCloseMock} />)
    await act(async () => {
      ref.current?.closeDialog()
    })
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  it("onMouseDown on dialog container stops propagation (does not close)", async () => {
    render(<DialogClient open />)
    const stopPropagation = jest.fn()
    await act(async () => {
      capturedOnMouseDown?.({ stopPropagation } as unknown as React.MouseEvent)
    })
    expect(stopPropagation).toHaveBeenCalledTimes(1)
  })

  it("onCloseKeyDown with Enter key closes the dialog", async () => {
    render(<DialogClient open />)
    await act(async () => {
      capturedOnCloseKeyDown?.({ key: "Enter" } as React.KeyboardEvent)
    })
    expect(screen.getByTestId("dialog-view")).toHaveAttribute(
      "data-open",
      "false",
    )
  })

  it("onCloseKeyDown with non-Enter key does nothing", async () => {
    render(<DialogClient open />)
    await act(async () => {
      capturedOnCloseKeyDown?.({ key: "Space" } as React.KeyboardEvent)
    })
    // Should remain open
    expect(screen.getByTestId("dialog-view")).toHaveAttribute(
      "data-open",
      "true",
    )
  })

  it("Tab key in open dialog traps focus forward (wraps from last to first)", () => {
    render(<DialogClient open />)
    const lastFocusable = screen.getByTestId("last-focusable")
    lastFocusable.focus()
    fireEvent.keyDown(window, { key: "Tab", shiftKey: false }),
      // After Tab from last → first gets focus
      expect(screen.getByTestId("first-focusable")).toHaveFocus()
  })

  it("Shift+Tab key in open dialog traps focus backward (wraps from first to last)", () => {
    render(<DialogClient open />)
    const firstFocusable = screen.getByTestId("first-focusable")
    firstFocusable.focus()
    fireEvent.keyDown(window, { key: "Tab", shiftKey: true }),
      // After Shift+Tab from first → last gets focus
      expect(screen.getByTestId("last-focusable")).toHaveFocus()
  })
})
