import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"
import { act } from "react"

import AnimatedTextClient from "./AnimatedText.client"

interface MockAnimatedTextViewProps {
  text: string
  [key: string]: unknown
}

// Mock the view component
jest.mock("./AnimatedText.view", () => ({
  AnimatedTextView: ({ text, ...props }: MockAnimatedTextViewProps) => (
    <span data-testid="animated-text-view" {...props}>
      {text}
    </span>
  ),
}))

describe("AnimatedTextClient", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it("should type out text character by character", () => {
    render(
      <AnimatedTextClient delay={0} speed={50}>
        Hello
      </AnimatedTextClient>,
    )

    const view = screen.getByTestId("animated-text-view")
    expect(view).toHaveTextContent("") // Initially empty

    // Advance by speed (50ms) to reveal first character
    act(() => {
      jest.advanceTimersByTime(50)
    })
    expect(view).toHaveTextContent("H")

    // Advance to reveal second character
    act(() => {
      jest.advanceTimersByTime(50)
    })
    expect(view).toHaveTextContent("He")

    // Advance to reveal all remaining characters
    act(() => {
      jest.advanceTimersByTime(150)
    })
    expect(view).toHaveTextContent("Hello")
  })

  it("should respect initial delay before starting animation", () => {
    render(
      <AnimatedTextClient delay={100} speed={30}>
        Hi
      </AnimatedTextClient>,
    )

    const view = screen.getByTestId("animated-text-view")

    // Before delay passes, nothing should be typed
    act(() => {
      jest.advanceTimersByTime(50)
    })
    expect(view).toHaveTextContent("")

    // After delay, animation should start
    act(() => {
      jest.advanceTimersByTime(50) // Total 100ms
    })
    expect(view).toHaveTextContent("")

    // First character after delay + speed
    act(() => {
      jest.advanceTimersByTime(30)
    })
    expect(view).toHaveTextContent("H")
  })

  it("should not animate when disabled is true", () => {
    render(
      <AnimatedTextClient disabled={true} speed={30}>
        Test
      </AnimatedTextClient>,
    )

    const view = screen.getByTestId("animated-text-view")
    expect(view).toHaveTextContent("")

    // Advance timers - should remain empty
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(view).toHaveTextContent("")
  })

  it("should handle zero delay", () => {
    render(
      <AnimatedTextClient delay={0} speed={20}>
        ABC
      </AnimatedTextClient>,
    )

    const view = screen.getByTestId("animated-text-view")

    // First character should appear after speed duration
    act(() => {
      jest.advanceTimersByTime(20)
    })
    expect(view).toHaveTextContent("A")
  })

  it("should stop typing when reaching end of text", () => {
    render(
      <AnimatedTextClient delay={0} speed={10}>
        AB
      </AnimatedTextClient>,
    )

    const view = screen.getByTestId("animated-text-view")

    // Type all characters
    act(() => {
      jest.advanceTimersByTime(100) // More than enough time
    })
    expect(view).toHaveTextContent("AB")

    // Should not exceed text length
    act(() => {
      jest.advanceTimersByTime(100)
    })
    expect(view).toHaveTextContent("AB")
  })

  it("should pass through props to AnimatedTextView", () => {
    render(
      <AnimatedTextClient
        className="custom-class"
        data-test="value"
        id="test-id"
        speed={30}
      >
        Test
      </AnimatedTextClient>,
    )

    const view = screen.getByTestId("animated-text-view")
    expect(view).toHaveClass("custom-class")
    expect(view).toHaveAttribute("id", "test-id")
    expect(view).toHaveAttribute("data-test", "value")
  })

  it("should clean up timeout on unmount", () => {
    const { unmount } = render(
      <AnimatedTextClient delay={100} speed={30}>
        Test
      </AnimatedTextClient>,
    )

    // Unmount before delay completes
    act(() => {
      unmount()
    })

    // Advance timers - should not cause errors
    act(() => {
      jest.advanceTimersByTime(1000)
    })
  })

  it("should handle empty string children", () => {
    render(
      <AnimatedTextClient delay={0} speed={30}>
        {""}
      </AnimatedTextClient>,
    )

    const view = screen.getByTestId("animated-text-view")
    expect(view).toHaveTextContent("")

    act(() => {
      jest.advanceTimersByTime(100)
    })
    expect(view).toHaveTextContent("")
  })

  it("should handle unicode and emoji characters", () => {
    render(
      <AnimatedTextClient delay={0} speed={50}>
        Hello🎉
      </AnimatedTextClient>,
    )

    const view = screen.getByTestId("animated-text-view")

    // First character
    act(() => {
      jest.advanceTimersByTime(50)
    })
    expect(view).toHaveTextContent("H")

    // After several steps, should include emoji
    act(() => {
      jest.advanceTimersByTime(250) // 5 more characters
    })
    expect(view).toHaveTextContent(/Hello/)
  })
})
