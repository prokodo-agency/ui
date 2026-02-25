import { act, render, screen } from "@/tests"

jest.mock("./Snackbar.view", () => ({
  SnackbarView: jest.fn(
    (props: { onClose?: (reason: string) => void; message?: string }) => (
      <div data-testid="snackbar-view">
        <span>{props.message ?? ""}</span>
        <button
          data-testid="close-btn"
          onClick={() => props.onClose?.("clickaway")}
        >
          Close
        </button>
      </div>
    ),
  ),
}))

const SnackbarClient = require("./Snackbar.client").default

beforeEach(() => jest.useFakeTimers())
afterEach(() => jest.useRealTimers())

describe("Snackbar.client", () => {
  it("renders null when open=false", () => {
    render(<SnackbarClient open={false} />)
    expect(screen.queryByTestId("snackbar-view")).not.toBeInTheDocument()
  })

  it("renders SnackbarView when open=true", () => {
    render(<SnackbarClient message="Hello" open={true} />)
    expect(screen.getByTestId("snackbar-view")).toBeInTheDocument()
  })

  it("auto-closes after autoHideDuration ms", () => {
    render(<SnackbarClient autoHideDuration={3000} open={true} />)
    expect(screen.getByTestId("snackbar-view")).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(3000)
    })
    expect(screen.queryByTestId("snackbar-view")).not.toBeInTheDocument()
  })

  it("calls onClose with 'timeout' reason when auto-hiding", () => {
    const onCloseMock = jest.fn()
    render(
      <SnackbarClient
        autoHideDuration={1000}
        open={true}
        onClose={onCloseMock}
      />,
    )
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(onCloseMock).toHaveBeenCalledWith("timeout", undefined)
  })

  it("does not auto-close when autoHideDuration=0", () => {
    render(<SnackbarClient autoHideDuration={0} open={true} />)
    act(() => {
      jest.advanceTimersByTime(10000)
    })
    expect(screen.getByTestId("snackbar-view")).toBeInTheDocument()
  })

  it("renders null when open prop is not provided (uses default false)", () => {
    render(<SnackbarClient />)
    expect(screen.queryByTestId("snackbar-view")).not.toBeInTheDocument()
  })

  it("closes when prop changes from true to false", () => {
    const { rerender } = render(<SnackbarClient open={true} />)
    expect(screen.getByTestId("snackbar-view")).toBeInTheDocument()

    rerender(<SnackbarClient open={false} />)
    expect(screen.queryByTestId("snackbar-view")).not.toBeInTheDocument()
  })

  it("passes onClose to SnackbarView and calls it on close", () => {
    const onCloseMock = jest.fn()
    render(
      <SnackbarClient autoHideDuration={0} open={true} onClose={onCloseMock} />,
    )

    act(() => {
      screen.getByTestId("close-btn").click()
    })
    expect(onCloseMock).toHaveBeenCalledWith("clickaway", undefined)
  })

  it("clears existing timer when autoHideDuration changes while open (timer.current truthy branch)", () => {
    const { rerender } = render(
      <SnackbarClient autoHideDuration={5000} open={true} />,
    )
    // First timer is set; re-render with different autoHideDuration triggers effect again
    // which hits the `if (timer.current) clearTimeout(timer.current)` branch
    rerender(<SnackbarClient autoHideDuration={1000} open={true} />)
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(screen.queryByTestId("snackbar-view")).not.toBeInTheDocument()
  })
})
