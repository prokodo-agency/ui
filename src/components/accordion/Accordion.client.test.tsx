import { expect } from "@jest/globals"
import { render, screen, fireEvent } from "@testing-library/react"

import AccordionClient from "./Accordion.client"

interface MockAccordionViewProps {
  items?: Array<{ title: string; renderContent: React.ReactNode }>
  expandedIndex?: number | null
  onToggle?: (index: number, e: React.MouseEvent) => void
  [key: string]: unknown
}

// Mock AccordionView to isolate client-side logic
jest.mock("./Accordion.view", () => ({
  AccordionView: ({
    items,
    expandedIndex,
    onToggle,
  }: MockAccordionViewProps) => (
    <div
      data-expanded-index={expandedIndex === null ? "null" : expandedIndex}
      data-testid="accordion-view"
    >
      {items?.map((item, index: number) => (
        <div key={index} data-testid={`accordion-item-${index}`}>
          <button
            data-testid={`accordion-toggle-${index}`}
            onClick={e => onToggle?.(index, e)}
          >
            {item.title}
          </button>
          {expandedIndex === index && (
            <div data-testid={`accordion-content-${index}`}>
              {typeof item.renderContent === "function"
                ? (item.renderContent as () => React.ReactNode)()
                : item.renderContent}
            </div>
          )}
        </div>
      ))}
    </div>
  ),
}))

describe("AccordionClient", () => {
  it("should handle client-side state management and toggle functionality", () => {
    const mockOnChange = jest.fn()

    render(
      <AccordionClient
        expanded={0}
        id="test-client"
        items={[
          { title: "Item 1", renderContent: <div>Content 1</div> },
          { title: "Item 2", renderContent: <div>Content 2</div> },
          { title: "Item 3", renderContent: <div>Content 3</div> },
        ]}
        onChange={mockOnChange}
      />,
    )

    // Check initial state
    const accordionView = screen.getByTestId("accordion-view")
    expect(accordionView).toHaveAttribute("data-expanded-index", "0")

    // Test first toggle (should collapse from index 0)
    const toggle0 = screen.getByTestId("accordion-toggle-0")
    fireEvent.click(toggle0)
    expect(accordionView).toHaveAttribute("data-expanded-index", "null")
    expect(mockOnChange).toHaveBeenCalledWith(
      undefined,
      expect.anything(),
      false,
    )

    // Test expand different item
    const toggle1 = screen.getByTestId("accordion-toggle-1")
    fireEvent.click(toggle1)
    expect(accordionView).toHaveAttribute("data-expanded-index", "1")
    expect(mockOnChange).toHaveBeenCalledWith(1, expect.anything(), true)

    // Test toggle to another item
    const toggle2 = screen.getByTestId("accordion-toggle-2")
    fireEvent.click(toggle2)
    expect(accordionView).toHaveAttribute("data-expanded-index", "2")
    expect(mockOnChange).toHaveBeenCalledWith(2, expect.anything(), true)
  })

  it("should handle expanded={null} initial state", () => {
    const mockOnChange = jest.fn()

    render(
      <AccordionClient
        expanded={null}
        id="test-null-expanded"
        items={[{ title: "Item 1", renderContent: <div>Content 1</div> }]}
        onChange={mockOnChange}
      />,
    )

    const accordionView = screen.getByTestId("accordion-view")
    expect(accordionView).toHaveAttribute("data-expanded-index", "null")
  })

  it("should call onChange callback with correct parameters", () => {
    const mockOnChange = jest.fn()

    render(
      <AccordionClient
        expanded={undefined}
        id="test-callback"
        items={[
          { title: "Item 1", renderContent: <div>Content 1</div> },
          { title: "Item 2", renderContent: <div>Content 2</div> },
        ]}
        onChange={mockOnChange}
      />,
    )

    const toggle1 = screen.getByTestId("accordion-toggle-1")
    fireEvent.click(toggle1)

    // Verify onChange was called with correct parameters
    expect(mockOnChange).toHaveBeenCalledWith(1, expect.any(Object), true)
  })

  it("should handle multiple toggling interactions", () => {
    const mockOnChange = jest.fn()

    render(
      <AccordionClient
        expanded={0}
        id="test-multiple-toggles"
        items={[
          { title: "Item 1", renderContent: <div>Content 1</div> },
          { title: "Item 2", renderContent: <div>Content 2</div> },
          { title: "Item 3", renderContent: <div>Content 3</div> },
        ]}
        onChange={mockOnChange}
      />,
    )

    const accordionView = screen.getByTestId("accordion-view")

    // Expand item 1 (currently expanded is 0)
    const toggle1 = screen.getByTestId("accordion-toggle-1")
    fireEvent.click(toggle1)
    expect(accordionView).toHaveAttribute("data-expanded-index", "1")

    // Expand item 2
    const toggle2 = screen.getByTestId("accordion-toggle-2")
    fireEvent.click(toggle2)
    expect(accordionView).toHaveAttribute("data-expanded-index", "2")

    // Collapse by clicking same item
    fireEvent.click(toggle2)
    expect(accordionView).toHaveAttribute("data-expanded-index", "null")

    // Expand item 0 again
    const toggle0 = screen.getByTestId("accordion-toggle-0")
    fireEvent.click(toggle0)
    expect(accordionView).toHaveAttribute("data-expanded-index", "0")

    // Verify onChange was called multiple times
    expect(mockOnChange).toHaveBeenCalledTimes(4)
  })
})
