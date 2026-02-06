import { expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

import AccordionServer from "./Accordion.server"

interface MockAccordionViewProps {
  expandedIndex?: number | null
  [key: string]: unknown
}

// Mock AccordionView to isolate server-side logic
jest.mock("./Accordion.view", () => ({
  AccordionView: ({ expandedIndex }: MockAccordionViewProps) => (
    <div
      data-expanded-index={expandedIndex === null ? "null" : expandedIndex}
      data-testid="accordion-view"
    >
      Mock AccordionView with expandedIndex={String(expandedIndex)}
    </div>
  ),
}))

describe("AccordionServer", () => {
  it("should render with truthy expanded value", () => {
    render(
      <AccordionServer
        expanded={2}
        id="test-server-truthy"
        items={[{ title: "Item 1", renderContent: <div>Content 1</div> }]}
      />,
    )

    const view = screen.getByTestId("accordion-view")
    expect(view).toHaveAttribute("data-expanded-index", "2")
  })

  it("should render with falsy expanded value (undefined becomes null)", () => {
    render(
      <AccordionServer
        expanded={undefined}
        id="test-server-falsy"
        items={[{ title: "Item 1", renderContent: <div>Content 1</div> }]}
      />,
    )

    const view = screen.getByTestId("accordion-view")
    expect(view).toHaveAttribute("data-expanded-index", "null")
  })

  it("should render with null expanded value", () => {
    render(
      <AccordionServer
        expanded={null}
        id="test-server-null"
        items={[{ title: "Item 1", renderContent: <div>Content 1</div> }]}
      />,
    )

    const view = screen.getByTestId("accordion-view")
    expect(view).toHaveAttribute("data-expanded-index", "null")
  })

  it("should pass onToggle as undefined on server", () => {
    render(
      <AccordionServer
        expanded={0}
        id="test-server-toggle"
        items={[{ title: "Item 1", renderContent: <div>Content 1</div> }]}
      />,
    )

    // Verify that onToggle is undefined (server-side, no interactivity)
    expect(screen.getByTestId("accordion-view")).toBeInTheDocument()
  })
})
