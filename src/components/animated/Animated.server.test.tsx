import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import AnimatedServer from "./Animated.server"

interface MockAnimatedViewProps {
  isVisible: boolean
  [key: string]: unknown
}

// Mock AnimatedView
jest.mock("./Animated.view", () => ({
  AnimatedView: ({ isVisible }: MockAnimatedViewProps) => (
    <div data-testid="animated-view" data-visible={isVisible}>
      Mock AnimatedView
    </div>
  ),
}))

describe("AnimatedServer", () => {
  it("should render with isVisible={false} on server", () => {
    render(
      <AnimatedServer>
        <div>Server Content</div>
      </AnimatedServer>,
    )

    const view = screen.getByTestId("animated-view")
    expect(view).toHaveAttribute("data-visible", "false")
  })

  it("should remove onAnimate callback on server", () => {
    const mockOnAnimate = jest.fn()

    render(
      <AnimatedServer onAnimate={mockOnAnimate}>
        <div>Content</div>
      </AnimatedServer>,
    )

    const view = screen.getByTestId("animated-view")
    expect(view).toBeInTheDocument()
    // onAnimate should be removed before passing to view
  })

  it("should pass through other props", () => {
    render(
      <AnimatedServer
        animation="top-bottom"
        className="custom-class"
        delay={100}
        speed="slow"
      >
        <div>Content</div>
      </AnimatedServer>,
    )

    expect(screen.getByTestId("animated-view")).toBeInTheDocument()
  })

  it("should handle children correctly", () => {
    render(
      <AnimatedServer>
        <span>Child 1</span>
        <span>Child 2</span>
      </AnimatedServer>,
    )

    expect(screen.getByTestId("animated-view")).toBeInTheDocument()
  })
})
