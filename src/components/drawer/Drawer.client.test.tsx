import { act, render, screen, fireEvent } from "@/tests"

let capturedOnMouseDown: ((e: React.MouseEvent) => void) | undefined

const mockView = jest.fn((props: Record<string, unknown>) => {
  capturedOnMouseDown = props.onMouseDown as (e: React.MouseEvent) => void
  return (
    <div
      ref={props.containerRef as React.Ref<HTMLDivElement>}
      data-open={String(props.open ?? false)}
      data-testid="drawer-view"
    >
      <button
        data-testid="backdrop"
        onMouseDown={
          (props.backdropProps as Record<string, unknown>)
            ?.onMouseDown as React.MouseEventHandler
        }
      >
        backdrop
      </button>
    </div>
  )
})

jest.mock("./Drawer.view", () => ({ DrawerView: mockView }))

const DrawerClient = require("./Drawer.client").default

beforeEach(() => {
  mockView.mockClear()
  capturedOnMouseDown = undefined
  jest.useFakeTimers()
})
afterEach(() => jest.useRealTimers())

describe("Drawer.client", () => {
  it("renders nothing when open=false (initially not mounted)", () => {
    const { container } = render(<DrawerClient />)
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("[data-testid='drawer-view']")).toBeNull()
  })

  it("renders when open=true", () => {
    render(<DrawerClient open />)
    jest.runAllTimers()
    expect(screen.getByTestId("drawer-view")).toBeInTheDocument()
  })

  it("sets isOpen=true after RAF when open=true", () => {
    render(<DrawerClient open />)
    jest.runAllTimers()
    expect(screen.getByTestId("drawer-view")).toHaveAttribute(
      "data-open",
      "true",
    )
  })

  it("closes on Escape key when open", () => {
    const onChangeMock = jest.fn()
    render(<DrawerClient open onChange={onChangeMock} />)
    jest.runAllTimers()
    fireEvent.keyDown(window, { key: "Escape" })
    expect(onChangeMock).toHaveBeenCalledWith(
      expect.any(Object),
      "escapeKeyDown",
    )
  })

  it("closes on backdrop mousedown when closeOnBackdropClick=true", () => {
    const onChangeMock = jest.fn()
    render(<DrawerClient open onChange={onChangeMock} />)
    jest.runAllTimers()
    fireEvent.mouseDown(screen.getByTestId("backdrop"))
    expect(onChangeMock).toHaveBeenCalledWith(
      expect.any(Object),
      "backdropClick",
    )
  })

  it("does not close on backdrop mousedown when closeOnBackdropClick=false", () => {
    const onChangeMock = jest.fn()
    render(
      <DrawerClient
        open
        closeOnBackdropClick={false}
        onChange={onChangeMock}
      />,
    )
    jest.runAllTimers()
    fireEvent.mouseDown(screen.getByTestId("backdrop"))
    expect(onChangeMock).not.toHaveBeenCalled()
  })

  it("opens via imperative ref", async () => {
    const ref = { current: null } as unknown as React.RefObject<{
      openDrawer(): void
      closeDrawer(reason?: string): void
    }>
    render(<DrawerClient ref={ref} />)
    // openDrawer() sets mounted=true then schedules RAFs (~16ms each).
    // The unmount-after-close effect also fires (isOpen=false, mounted=true) and
    // schedules a 450ms fallback. Advance by 100ms → fires both RAFs but not the
    // 450ms timer. After setIsOpen(true) the 450ms timer is cancelled by cleanup.
    await act(async () => {
      ref.current?.openDrawer()
    })
    act(() => {
      jest.advanceTimersByTime(100)
    })
    expect(screen.getByTestId("drawer-view")).toHaveAttribute(
      "data-open",
      "true",
    )
  })

  it("calls onChange when closeDrawer is invoked via ref", async () => {
    const onChangeMock = jest.fn()
    const ref = { current: null } as unknown as React.RefObject<{
      openDrawer(): void
      closeDrawer(reason?: string): void
    }>
    render(<DrawerClient ref={ref} open onChange={onChangeMock} />)
    jest.runAllTimers()
    await act(async () => {
      ref.current?.closeDrawer("backdropClick")
    })
    expect(onChangeMock).toHaveBeenCalledWith(
      expect.any(Object),
      "backdropClick",
    )
  })

  it("unmounts when open prop changes to false", () => {
    const { container, rerender } = render(<DrawerClient open />)
    jest.runAllTimers()
    expect(screen.getByTestId("drawer-view")).toBeInTheDocument()
    // useLayoutEffect fires when open=false → setIsOpen(false) + setMounted(false)
    rerender(<DrawerClient open={false} />)
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("[data-testid='drawer-view']")).toBeNull()
  })

  it("onMouseDown on drawer content stops propagation", async () => {
    render(<DrawerClient open />)
    jest.runAllTimers()
    const stopPropagation = jest.fn()
    await act(async () => {
      capturedOnMouseDown?.({ stopPropagation } as unknown as React.MouseEvent)
    })
    expect(stopPropagation).toHaveBeenCalledTimes(1)
  })

  it("opens when open prop changes from false to true (already mounted=false path)", () => {
    const { rerender } = render(<DrawerClient open={false} />)
    rerender(<DrawerClient open={true} />)
    act(() => {
      jest.runAllTimers()
    })
    expect(screen.getByTestId("drawer-view")).toHaveAttribute(
      "data-open",
      "true",
    )
  })

  it("closeDrawer passes reason to onChange", async () => {
    const onChangeMock = jest.fn()
    const ref = { current: null } as unknown as React.RefObject<{
      openDrawer(): void
      closeDrawer(reason?: string): void
    }>
    render(<DrawerClient ref={ref} open onChange={onChangeMock} />)
    jest.runAllTimers()
    await act(async () => {
      ref.current?.closeDrawer("escapeKeyDown")
    })
    expect(onChangeMock).toHaveBeenCalledWith(
      expect.any(Object),
      "escapeKeyDown",
    )
  })

  it("transitionend on container triggers unmount (onEnd)", async () => {
    const { container, rerender } = render(<DrawerClient open />)
    jest.runAllTimers()
    const drawerEl = screen.getByTestId("drawer-view")
    // Close drawer → isOpen becomes false, mounted stays true
    rerender(<DrawerClient open={false} />)
    // At this point: isOpen=false, mounted=true → transitionend listener registered
    // Fire the transitionend event on the container node
    await act(async () => {
      const event = new Event("transitionend", { bubbles: false })
      Object.defineProperty(event, "target", {
        value: drawerEl,
        configurable: true,
      })
      drawerEl.dispatchEvent(event)
    })
    jest.runAllTimers()
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelector("[data-testid='drawer-view']")).toBeNull()
  })
})
