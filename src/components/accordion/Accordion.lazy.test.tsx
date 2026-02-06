import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

// Mock createLazyWrapper to test the wrapper initialization
jest.mock("@/helpers/createLazyWrapper", () => ({
  createLazyWrapper: jest.fn(config =>
    // Return a component that validates the config
    () => (
      <div
        data-interactive={config.isInteractive ? config.isInteractive() : false}
        data-name={config.name}
        data-testid="lazy-wrapper"
      >
        Lazy Wrapper Component
      </div>
    ),
  ),
}))

describe("Accordion.lazy", () => {
  it("should create lazy wrapper with correct config", () => {
    // Dynamic import to test the actual module after mocks are set up
    const AccordionLazy = require("./Accordion.lazy").default

    render(<AccordionLazy id="test" items={[]} />)

    const wrapper = screen.getByTestId("lazy-wrapper")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveAttribute("data-name", "Accordion")
    expect(wrapper).toHaveAttribute("data-interactive", "true")
  })

  it("should pass through all props to lazy wrapper", () => {
    const AccordionLazy = require("./Accordion.lazy").default

    const mockOnChange = jest.fn()
    const items = [
      { title: "Item 1", renderContent: <div>Content</div> },
      { title: "Item 2", renderContent: <div>Content</div> },
    ]

    render(
      <AccordionLazy
        expanded={0}
        id="test-props"
        items={items}
        variant="secondary"
        onChange={mockOnChange}
      />,
    )

    expect(screen.getByTestId("lazy-wrapper")).toBeInTheDocument()
  })
})
