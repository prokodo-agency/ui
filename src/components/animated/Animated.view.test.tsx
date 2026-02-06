import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import { AnimatedView } from "./Animated.view"

// Mock bem helper
jest.mock("@/helpers/bem", () => ({
  create:
    (_styles: Record<string, string>, blockName: string) =>
    (_block?: string, mods?: Record<string, unknown>, cls?: string) => {
      const parts = [blockName]
      if (mods) {
        Object.entries(mods).forEach(([key, value]) => {
          if (value) {
            parts.push(`${blockName}--${key}`)
          }
        })
      }
      if (cls) parts.push(cls)
      return parts.join(" ")
    },
}))

// Mock the styles module
jest.mock("./Animated.module.scss", () => ({}))

describe("AnimatedView", () => {
  it("should render children correctly", () => {
    render(
      <AnimatedView isVisible={true}>
        <span>Test Content</span>
      </AnimatedView>,
    )

    expect(screen.getByText("Test Content")).toBeInTheDocument()
  })

  it("should apply is-visible class when isVisible is true", () => {
    render(
      <AnimatedView data-testid="animated-view" isVisible={true}>
        <div>Content</div>
      </AnimatedView>,
    )

    const element = screen.getByTestId("animated-view")
    expect(element).toHaveClass("Animated--is-visible")
  })

  it("should not apply is-visible class when isVisible is false", () => {
    render(
      <AnimatedView data-testid="animated-view" isVisible={false}>
        <div>Content</div>
      </AnimatedView>,
    )

    const element = screen.getByTestId("animated-view")
    expect(element).not.toHaveClass("Animated--is-visible")
  })

  it("should apply is-disabled class when disabled is true", () => {
    render(
      <AnimatedView
        data-testid="animated-view"
        disabled={true}
        isVisible={false}
      >
        <div>Content</div>
      </AnimatedView>,
    )

    const element = screen.getByTestId("animated-view")
    expect(element).toHaveClass("Animated--is-disabled")
  })

  it("should apply speed class based on speed prop", () => {
    const speeds: Array<"slow" | "fast"> = ["slow", "fast"]

    speeds.forEach(speed => {
      render(
        <AnimatedView
          data-testid={`animated-view-${speed}`}
          isVisible={true}
          speed={speed}
        >
          <div>Content</div>
        </AnimatedView>,
      )

      const element = screen.getByTestId(`animated-view-${speed}`)
      expect(element).toHaveClass(`Animated--has-${speed}-speed`)
    })
  })

  it("should apply animation class based on animation prop", () => {
    const animations: Array<
      "bottom-top" | "top-bottom" | "left-right" | "right-left"
    > = ["bottom-top", "top-bottom", "left-right", "right-left"]

    animations.forEach(animation => {
      render(
        <AnimatedView
          animation={animation}
          data-testid={`animated-view-${animation}`}
          isVisible={true}
        >
          <div>Content</div>
        </AnimatedView>,
      )

      const element = screen.getByTestId(`animated-view-${animation}`)
      expect(element).toHaveClass(`Animated--animate-${animation}`)
    })
  })

  it("should apply custom className", () => {
    render(
      <AnimatedView
        className="custom-class"
        data-testid="animated-view"
        isVisible={true}
      >
        <div>Content</div>
      </AnimatedView>,
    )

    const element = screen.getByTestId("animated-view")
    expect(element).toHaveClass("custom-class")
  })

  it("should combine all classes correctly", () => {
    render(
      <AnimatedView
        animation="bottom-top"
        className="my-custom-class"
        data-testid="animated-view"
        disabled={false}
        isVisible={true}
        speed="fast"
      >
        <div>Content</div>
      </AnimatedView>,
    )

    const element = screen.getByTestId("animated-view")
    expect(element).toHaveClass("Animated")
    expect(element).toHaveClass("Animated--is-visible")
    expect(element).toHaveClass("Animated--has-fast-speed")
    expect(element).toHaveClass("Animated--animate-bottom-top")
    expect(element).toHaveClass("my-custom-class")
  })

  it("should pass through DOM attributes", () => {
    render(
      <AnimatedView
        className="custom-with-attrs"
        data-testid="test-animated"
        isVisible={true}
      >
        <div>Content</div>
      </AnimatedView>,
    )

    const element = screen.getByTestId("test-animated")
    expect(element).toHaveClass("custom-with-attrs")
    expect(element).toHaveAttribute("data-testid", "test-animated")
  })

  it("should have correct displayName", () => {
    expect(AnimatedView.displayName).toBe("AnimatedView")
  })

  it("should handle multiple children", () => {
    render(
      <AnimatedView isVisible={true}>
        <span>Child 1</span>
        <span>Child 2</span>
        <span>Child 3</span>
      </AnimatedView>,
    )

    expect(screen.getByText("Child 1")).toBeInTheDocument()
    expect(screen.getByText("Child 2")).toBeInTheDocument()
    expect(screen.getByText("Child 3")).toBeInTheDocument()
  })

  it("should not require speed and animation props", () => {
    render(
      <AnimatedView data-testid="animated-view" isVisible={true}>
        <div>Content</div>
      </AnimatedView>,
    )

    const element = screen.getByTestId("animated-view")
    // When speed and animation are undefined, should still render
    expect(element).toHaveClass("Animated")
    expect(element).toHaveClass("Animated--is-visible")
  })

  it("should apply default values correctly", () => {
    render(
      <AnimatedView data-testid="animated-view" isVisible={false}>
        <div>Content</div>
      </AnimatedView>,
    )

    const element = screen.getByTestId("animated-view")
    // Should apply default speed="normal" and animation="fade-in"
    expect(element).toHaveClass("Animated--has-normal-speed")
    expect(element).toHaveClass("Animated--animate-fade-in")
    expect(element).not.toHaveClass("Animated--is-disabled")
  })
})
