import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import AnimatedTextServer from "./AnimatedText.server"

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

describe("AnimatedTextServer", () => {
  it("should render with empty text on server", () => {
    render(
      <AnimatedTextServer delay={100} speed={30}>
        Hello World
      </AnimatedTextServer>,
    )

    const view = screen.getByTestId("animated-text-view")
    expect(view).toHaveTextContent("") // Server renders empty initially
  })

  it("should pass through props except children", () => {
    render(
      <AnimatedTextServer
        className="custom-class"
        data-custom="value"
        id="test-id"
      >
        Test Content
      </AnimatedTextServer>,
    )

    const view = screen.getByTestId("animated-text-view")
    expect(view).toHaveClass("custom-class")
    expect(view).toHaveAttribute("id", "test-id")
    expect(view).toHaveAttribute("data-custom", "value")
    expect(view).toHaveTextContent("") // Children ignored on server
  })

  it("should ignore children prop on server", () => {
    render(
      <AnimatedTextServer>This should not appear on server</AnimatedTextServer>,
    )

    const view = screen.getByTestId("animated-text-view")
    expect(view).toHaveTextContent("")
  })

  it("should handle all props correctly", () => {
    render(
      <AnimatedTextServer
        className="server-class"
        delay={200}
        disabled={true}
        speed={50}
      >
        Server content
      </AnimatedTextServer>,
    )

    const view = screen.getByTestId("animated-text-view")
    expect(view).toHaveClass("server-class")
    expect(view).toHaveTextContent("")
  })
})
