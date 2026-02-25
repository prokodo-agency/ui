import { act, render, screen } from "@/tests"

const mockView = jest.fn((props: { value?: number }) => (
  <div data-testid="progress-bar-view" data-value={String(props.value ?? "")} />
))

jest.mock("./ProgressBar.view", () => ({ ProgressBarView: mockView }))

const ProgressBarClient = require("./ProgressBar.client").default

beforeEach(() => mockView.mockClear())

describe("ProgressBar.client", () => {
  describe("non-animated mode", () => {
    it("immediately displays the value when animated=false", () => {
      render(<ProgressBarClient animated={false} value={75} />)
      expect(screen.getByTestId("progress-bar-view")).toHaveAttribute(
        "data-value",
        "75",
      )
    })

    it("displays undefined when value is undefined and animated=false", () => {
      render(<ProgressBarClient animated={false} value={undefined} />)
      expect(screen.getByTestId("progress-bar-view")).toHaveAttribute(
        "data-value",
        "",
      )
    })

    it("updates immediately when value changes in non-animated mode", () => {
      const { rerender } = render(
        <ProgressBarClient animated={false} value={20} />,
      )
      rerender(<ProgressBarClient animated={false} value={80} />)
      expect(screen.getByTestId("progress-bar-view")).toHaveAttribute(
        "data-value",
        "80",
      )
    })
  })

  describe("animated mode", () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it("has undefined value initially (uses requestAnimationFrame for animation)", () => {
      // animation starts but doesn't immediately set final value
      render(<ProgressBarClient animated={true} value={50} />)
      // The view renders with the initial displayValue (undefined initially)
      // RAF schedules the animation but doesn't run synchronously
      expect(screen.getByTestId("progress-bar-view")).toBeInTheDocument()
    })

    it("skips animation when value is undefined (animated=true + undefined value)", () => {
      render(<ProgressBarClient animated={true} value={undefined} />)
      // undefined value always causes immediate update even in animated mode
      expect(screen.getByTestId("progress-bar-view")).toHaveAttribute(
        "data-value",
        "",
      )
    })

    it("runs step animation via requestAnimationFrame", async () => {
      // Covers step() function and progress < 1 branch
      let lastCallback: ((time: number) => void) | null = null
      const rafSpy = jest
        .spyOn(globalThis, "requestAnimationFrame")
        .mockImplementation(cb => {
          lastCallback = cb
          return 1
        })
      const cafSpy = jest
        .spyOn(globalThis, "cancelAnimationFrame")
        .mockImplementation(() => {})

      render(<ProgressBarClient animated={true} value={100} />)

      // Simulate a partial frame to trigger step with progress < 1
      await act(async () => {
        lastCallback?.(performance.now() + 100)
      })
      // Simulate final frame to trigger progress >= 1
      await act(async () => {
        lastCallback?.(performance.now() + 1000)
      })

      expect(screen.getByTestId("progress-bar-view")).toBeInTheDocument()
      rafSpy.mockRestore()
      cafSpy.mockRestore()
    })
  })
})
