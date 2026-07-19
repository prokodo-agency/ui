import { act, render, screen, fireEvent } from "@/tests"

let capturedOnMouseDown: ((e: React.MouseEvent) => void) | undefined
let capturedOnCloseKeyDown: ((e: React.KeyboardEvent) => void) | undefined
const overriddenProperties: Array<{
  target: object
  property: PropertyKey
  descriptor: PropertyDescriptor | undefined
}> = []

const overrideProperty = (
  target: object,
  property: PropertyKey,
  value: unknown,
) => {
  overriddenProperties.push({
    target,
    property,
    descriptor: Object.getOwnPropertyDescriptor(target, property),
  })
  Object.defineProperty(target, property, {
    configurable: true,
    writable: true,
    value,
  })
}

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
afterEach(() => {
  for (const {
    target,
    property,
    descriptor,
  } of overriddenProperties.reverse()) {
    if (descriptor) Object.defineProperty(target, property, descriptor)
    else Reflect.deleteProperty(target, property)
  }
  overriddenProperties.length = 0
  jest.useRealTimers()
})

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

  it("closes when the controlled open prop changes to false", () => {
    const { rerender } = render(<DialogClient open={true} />)
    expect(screen.getByTestId("dialog-view")).toHaveAttribute(
      "data-open",
      "true",
    )

    rerender(<DialogClient open={false} />)
    expect(screen.getByTestId("dialog-view")).toHaveAttribute(
      "data-open",
      "false",
    )
  })

  it("locks and restores body when body owns the scroll offset", () => {
    const { body } = document
    const html = document.documentElement
    overrideProperty(body, "scrollTop", 120)
    overrideProperty(html, "scrollTop", 80)
    overrideProperty(html, "clientWidth", window.innerWidth - 20)

    const { rerender } = render(<DialogClient open />)

    expect(body).toHaveStyle({ overflow: "hidden" })
    expect(body).toHaveStyle({ paddingRight: "20px" })
    expect(html).not.toHaveStyle({ overflow: "hidden" })

    rerender(<DialogClient open={false} />)
    expect(body).toHaveStyle({ overflow: "" })
    expect(body).toHaveStyle({ paddingRight: "" })
    expect(body.scrollTop).toBe(120)
  })

  it("locks and restores html when html owns the scroll offset", () => {
    const { body } = document
    const html = document.documentElement
    overrideProperty(body, "scrollTop", 0)
    overrideProperty(html, "scrollTop", 85)

    const { rerender } = render(<DialogClient open />)

    expect(html).toHaveStyle({ overflow: "hidden" })
    expect(body).not.toHaveStyle({ overflow: "hidden" })

    rerender(<DialogClient open={false} />)
    expect(html).toHaveStyle({ overflow: "" })
    expect(html.scrollTop).toBe(85)
  })

  it("locks a scrollable body without adding padding when no scrollbar exists", () => {
    const { body } = document
    const html = document.documentElement
    overrideProperty(body, "scrollTop", 0)
    overrideProperty(html, "scrollTop", 0)
    overrideProperty(body, "scrollHeight", 1000)
    overrideProperty(body, "clientHeight", 500)
    overrideProperty(html, "clientWidth", window.innerWidth)
    body.style.paddingRight = "7px"

    const { rerender } = render(<DialogClient open />)

    expect(body).toHaveStyle({ overflow: "hidden" })
    expect(body).toHaveStyle({ paddingRight: "7px" })

    rerender(<DialogClient open={false} />)
    expect(body).toHaveStyle({ overflow: "" })
    expect(body).toHaveStyle({ paddingRight: "7px" })
    body.style.paddingRight = ""
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
