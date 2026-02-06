import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

// Mock createLazyWrapper
jest.mock("@/helpers/createLazyWrapper", () => ({
  createLazyWrapper: jest.fn(config => () => (
    <div
      data-hydrate-on-visible={config.hydrateOnVisible ? "true" : "false"}
      data-interactive={config.isInteractive ? config.isInteractive() : false}
      data-name={config.name}
      data-testid="lazy-wrapper"
    >
      Lazy Wrapper Component
    </div>
  )),
}))

describe("Animated.lazy", () => {
  it("should create lazy wrapper with correct config", () => {
    const AnimatedLazy = require("./Animated.lazy").default

    render(
      <AnimatedLazy>
        <div>Content</div>
      </AnimatedLazy>,
    )

    const wrapper = screen.getByTestId("lazy-wrapper")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveAttribute("data-name", "Animated")
    expect(wrapper).toHaveAttribute("data-interactive", "true")
    expect(wrapper).toHaveAttribute("data-hydrate-on-visible", "true")
  })

  it("should pass through props to lazy wrapper", () => {
    const AnimatedLazy = require("./Animated.lazy").default
    const mockOnAnimate = jest.fn()

    render(
      <AnimatedLazy animation="fadeIn" delay={100} onAnimate={mockOnAnimate}>
        <span>Animated Content</span>
      </AnimatedLazy>,
    )

    expect(screen.getByTestId("lazy-wrapper")).toBeInTheDocument()
  })
})
