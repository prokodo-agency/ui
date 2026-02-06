import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import { AnimatedTextView } from "./AnimatedText.view"

describe("AnimatedTextView", () => {
  it("should render text correctly", () => {
    render(<AnimatedTextView text="Hello World" />)

    expect(screen.getByText("Hello World")).toBeInTheDocument()
  })

  it("should render empty text", () => {
    render(<AnimatedTextView text="" />)

    const span = screen.getByText("", { selector: "span" })
    expect(span).toHaveTextContent("")
  })

  it("should render as span element", () => {
    render(<AnimatedTextView text="Test" />)

    const span = screen.getByText("Test")
    expect(span.tagName).toBe("SPAN")
  })

  it("should apply custom className", () => {
    render(<AnimatedTextView className="custom-class" text="Test" />)

    const span = screen.getByText("Test")
    expect(span).toHaveClass("custom-class")
  })

  it("should pass through DOM attributes", () => {
    render(
      <AnimatedTextView
        aria-label="Animated text"
        data-testid="test-span"
        id="custom-id"
        text="Test"
      />,
    )

    const span = screen.getByTestId("test-span")
    expect(span).toHaveAttribute("id", "custom-id")
    expect(span).toHaveAttribute("aria-label", "Animated text")
  })

  it("should have correct displayName", () => {
    expect(AnimatedTextView.displayName).toBe("AnimatedTextView")
  })

  it("should handle unicode characters", () => {
    render(<AnimatedTextView text="Hello 世界" />)

    expect(screen.getByText("Hello 世界")).toBeInTheDocument()
  })

  it("should handle emoji characters", () => {
    render(<AnimatedTextView text="🚀 🎉" />)

    expect(screen.getByText("🚀 🎉")).toBeInTheDocument()
  })

  it("should handle special characters", () => {
    render(<AnimatedTextView text="@#$%^&*()" />)

    expect(screen.getByText("@#$%^&*()")).toBeInTheDocument()
  })

  it("should handle long text", () => {
    const longText =
      "This is a very long text that should be rendered correctly without any issues"
    render(<AnimatedTextView text={longText} />)

    expect(screen.getByText(longText)).toBeInTheDocument()
  })

  it("should handle partial text (typing animation state)", () => {
    render(<AnimatedTextView text="Hello W" />)

    expect(screen.getByText("Hello W")).toBeInTheDocument()
  })

  it("should combine custom attributes and className", () => {
    render(
      <AnimatedTextView
        className="class-1 class-2"
        data-testid="test-element"
        id="test-id"
        style={{ color: "red" }}
        text="Test"
      />,
    )

    const span = screen.getByTestId("test-element")
    expect(span).toHaveClass("class-1")
    expect(span).toHaveClass("class-2")
    expect(span).toHaveAttribute("id", "test-id")
    expect(span).toHaveStyle({ color: "red" })
  })
})
