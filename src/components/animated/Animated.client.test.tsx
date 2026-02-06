import { expect } from "@jest/globals"
import { act } from "@testing-library/react"

import { render, screen } from "@/tests"

import AnimatedClient from "./Animated.client"

// Mock AnimatedView to isolate client-side logic
jest.mock("./Animated.view", () => ({
  AnimatedView: ({ isVisible, disabled, children }) => (
    <div
      data-disabled={disabled}
      data-testid="animated-view"
      data-visible={isVisible}
    >
      {children}
    </div>
  ),
}))

describe("AnimatedClient", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it("should set isVisible to true after delay", async () => {
    const mockOnAnimate = jest.fn()

    render(
      <AnimatedClient delay={100} onAnimate={mockOnAnimate}>
        <div>Animated Content</div>
      </AnimatedClient>,
    )

    act(() => {
      jest.advanceTimersByTime(100)
    })

    expect(mockOnAnimate).toHaveBeenCalledWith(true)
  })

  it("should not animate when disabled prop is true", async () => {
    const mockOnAnimate = jest.fn()

    render(
      <AnimatedClient delay={50} disabled={true} onAnimate={mockOnAnimate}>
        <div>Content</div>
      </AnimatedClient>,
    )

    act(() => {
      jest.advanceTimersByTime(100)
    })

    expect(mockOnAnimate).not.toHaveBeenCalled()
  })

  it("should clear timeout on unmount", () => {
    const mockOnAnimate = jest.fn()
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout")

    const { unmount } = render(
      <AnimatedClient delay={1000} onAnimate={mockOnAnimate}>
        <div>Content</div>
      </AnimatedClient>,
    )

    act(() => {
      unmount()
    })

    expect(clearTimeoutSpy).toHaveBeenCalled()
    clearTimeoutSpy.mockRestore()
  })

  it("should handle zero delay", () => {
    const mockOnAnimate = jest.fn()

    render(
      <AnimatedClient delay={0} onAnimate={mockOnAnimate}>
        <div>Content</div>
      </AnimatedClient>,
    )

    act(() => {
      jest.advanceTimersByTime(0)
    })

    expect(mockOnAnimate).toHaveBeenCalledWith(true)
  })

  it("should respect different delay values", () => {
    const mockOnAnimate = jest.fn()

    render(
      <AnimatedClient delay={500} onAnimate={mockOnAnimate}>
        <div>Content</div>
      </AnimatedClient>,
    )

    // Before delay
    act(() => {
      jest.advanceTimersByTime(250)
    })
    expect(mockOnAnimate).not.toHaveBeenCalled()

    // After delay
    act(() => {
      jest.advanceTimersByTime(250)
    })
    expect(mockOnAnimate).toHaveBeenCalledWith(true)
  })

  it("should pass through props to AnimatedView", () => {
    render(
      <AnimatedClient
        animation="bottom-top"
        className="custom-class"
        delay={100}
        speed="slow"
      >
        <div>Content</div>
      </AnimatedClient>,
    )

    const view = screen.getByTestId("animated-view")
    expect(view).toBeInTheDocument()
  })

  it("should handle disabled state change", () => {
    const mockOnAnimate = jest.fn()

    render(
      <AnimatedClient delay={100} disabled={false} onAnimate={mockOnAnimate}>
        <div>Content</div>
      </AnimatedClient>,
    )

    act(() => {
      jest.advanceTimersByTime(100)
    })

    expect(mockOnAnimate).toHaveBeenCalled()
  })

  it("should call onAnimate with true when timeout completes", () => {
    const mockOnAnimate = jest.fn()

    render(
      <AnimatedClient delay={200} onAnimate={mockOnAnimate}>
        <div>Content</div>
      </AnimatedClient>,
    )

    act(() => {
      jest.advanceTimersByTime(200)
    })

    expect(mockOnAnimate).toHaveBeenCalledWith(true)
    expect(mockOnAnimate).toHaveBeenCalledTimes(1)
  })
})
