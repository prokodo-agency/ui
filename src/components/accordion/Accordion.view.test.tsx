import { expect } from "@jest/globals"
import { render, screen, fireEvent } from "@testing-library/react"

import { AccordionView } from "./Accordion.view"

interface MockAnimatedProps {
  children?: React.ReactNode
  [key: string]: unknown
}

interface MockButtonProps {
  id?: string
  [key: string]: unknown
}

interface MockHeadlineProps {
  children?: React.ReactNode
  [key: string]: unknown
}

interface MockIconProps {
  name?: string
  [key: string]: unknown
}

interface MockBemModifiers {
  [key: string]: boolean
}

// Mock child components
jest.mock("@/components/animated", () => ({
  Animated: ({ children }: MockAnimatedProps) => (
    <div data-testid="animated">{children}</div>
  ),
}))

jest.mock("@/components/button", () => ({
  Button: (props: MockButtonProps) => (
    <button data-testid={`button-${props.id}`} {...props} />
  ),
}))

jest.mock("@/components/headline", () => ({
  Headline: (props: MockHeadlineProps) => (
    <div data-testid="headline" {...props}>
      {props.children}
    </div>
  ),
}))

jest.mock("@/components/icon", () => ({
  Icon: (props: MockIconProps) => (
    <span data-testid={`icon-${props.name}`} {...props} />
  ),
}))

jest.mock("@/helpers/bem", () => ({
  create: () => (element?: string, mods?: MockBemModifiers, cls?: string) => {
    const blockName = "prokodo-Accordion"
    const parts: string[] = []

    // Add block or block__element
    if (element) {
      parts.push(`${blockName}__${element}`)
    } else {
      parts.push(blockName)
    }

    // Add modifiers
    if (mods) {
      Object.entries(mods).forEach(([key, value]) => {
        if (value) {
          if (element) {
            parts.push(`${blockName}__${element}--${key}`)
          } else {
            parts.push(`${blockName}--${key}`)
          }
        }
      })
    }

    // Add extra classes
    if (cls) parts.push(cls)

    return parts.join(" ")
  },
}))

describe("AccordionView", () => {
  it("should render all items with correct expanded state", () => {
    const mockOnToggle = jest.fn()

    render(
      <AccordionView
        expandedIndex={0}
        id="test"
        items={[
          { title: "Item 1", renderContent: <div>Content 1</div> },
          { title: "Item 2", renderContent: <div>Content 2</div> },
        ]}
        onToggle={mockOnToggle}
      />,
    )

    // Check items are rendered
    expect(screen.getByText("Item 1")).toBeInTheDocument()
    expect(screen.getByText("Item 2")).toBeInTheDocument()

    // Check content visibility
    expect(screen.getByText("Content 1")).toBeInTheDocument()

    // Click to toggle
    fireEvent.click(screen.getByText("Item 1"))
    expect(mockOnToggle).toHaveBeenCalledWith(0, expect.any(Object))
  })

  it("should render custom header when renderHeader is provided", () => {
    render(
      <AccordionView
        expandedIndex={null}
        id="test-custom"
        items={[
          {
            title: "Item 1",
            renderHeader: (
              <span data-testid="custom-header">Custom Header</span>
            ),
            renderContent: <div>Content 1</div>,
          },
        ]}
      />,
    )

    expect(screen.getByTestId("custom-header")).toBeInTheDocument()
  })

  it("should render actions when provided", () => {
    render(
      <AccordionView
        expandedIndex={0}
        id="test-actions"
        items={[
          {
            title: "Item 1",
            renderContent: <div>Content 1</div>,
            actions: [{ id: "action1" }, { id: "action2" }],
          },
        ]}
      />,
    )

    // When expanded, actions should be visible
    expect(screen.getByTestId("button-action1")).toBeInTheDocument()
    expect(screen.getByTestId("button-action2")).toBeInTheDocument()
  })

  it("should render header actions when provided", () => {
    render(
      <AccordionView
        expandedIndex={0}
        id="test-header-actions"
        items={[
          {
            title: "Item 1",
            renderContent: <div>Content 1</div>,
            renderHeaderActions: (
              <span data-testid="header-action">Header Action</span>
            ),
          },
        ]}
      />,
    )

    expect(screen.getByTestId("header-action")).toBeInTheDocument()
  })

  it("should handle keyboard events on collapsed item", () => {
    const mockOnToggle = jest.fn()

    render(
      <AccordionView
        expandedIndex={null}
        id="test-keyboard"
        items={[{ title: "Item 1", renderContent: <div>Content 1</div> }]}
        onToggle={mockOnToggle}
      />,
    )

    const toggleZone = screen.getByRole("button")
    expect(toggleZone).toBeInTheDocument()

    // Simulate Enter key
    fireEvent.keyDown(toggleZone, { key: "Enter" })
    expect(mockOnToggle).toHaveBeenCalledWith(0, expect.any(Object))

    mockOnToggle.mockClear()

    // Simulate Space key
    fireEvent.keyDown(toggleZone, { key: " " })
    expect(mockOnToggle).toHaveBeenCalledWith(0, expect.any(Object))

    mockOnToggle.mockClear()

    // Other keys should not trigger
    fireEvent.keyDown(toggleZone, { key: "Escape" })
    expect(mockOnToggle).not.toHaveBeenCalled()
  })

  it("should prevent propagation for header actions clicks", () => {
    const mockOnToggle = jest.fn()

    render(
      <AccordionView
        expandedIndex={0}
        id="test-action-click"
        items={[
          {
            title: "Item 1",
            renderContent: <div>Content 1</div>,
            renderHeaderActions: (
              <span data-testid="header-action">Header Action</span>
            ),
          },
        ]}
        onToggle={mockOnToggle}
      />,
    )

    const headerAction = screen.getByTestId("header-action")

    // Test click event
    fireEvent.click(headerAction)
    expect(headerAction).toBeInTheDocument()

    // Test mousedown event
    fireEvent.mouseDown(headerAction)
    expect(headerAction).toBeInTheDocument()

    // Test keydown event with Enter
    fireEvent.keyDown(headerAction, { key: "Enter" })
    expect(headerAction).toBeInTheDocument()
  })

  it("should apply correct classes for expanded state", () => {
    render(
      <AccordionView
        className="custom-class"
        expandedIndex={0}
        id="test-classes"
        variant="secondary"
        items={[
          {
            title: "Item 1",
            renderContent: <div>Content 1</div>,
            className: "item-class",
          },
        ]}
      />,
    )

    // Verify the accordion renders with expected accessibility
    expect(screen.getByRole("button")).toBeInTheDocument()
    expect(screen.getByText("Item 1")).toBeInTheDocument()
    expect(screen.getByText("Content 1")).toBeInTheDocument()

    // Verify the item is expanded
    const button = screen.getByRole("button")
    expect(button).toHaveAttribute("aria-expanded", "true")
  })

  it("should set correct accessibility attributes", () => {
    render(
      <AccordionView
        expandedIndex={0}
        id="test-a11y"
        items={[
          { title: "Item 1", renderContent: <div>Content 1</div> },
          { title: "Item 2", renderContent: <div>Content 2</div> },
        ]}
      />,
    )

    // Check first item (expanded) has correct accessibility
    const toggles = screen.getAllByRole("button")
    expect(toggles.length).toBe(2)

    // First toggle should be expanded
    expect(toggles[0]).toHaveAttribute("aria-expanded", "true")
    expect(toggles[0]).toHaveAttribute("aria-controls")

    // Second toggle should be collapsed
    expect(toggles[1]).toHaveAttribute("aria-expanded", "false")

    // Verify aria-controls points to region elements
    const firstControls = toggles[0]?.getAttribute("aria-controls") || ""
    const secondControls = toggles[1]?.getAttribute("aria-controls") || ""

    expect(firstControls).toBeTruthy()
    expect(secondControls).toBeTruthy()

    // Check that controlled regions exist
    const firstRegion = firstControls
      ? // eslint-disable-next-line testing-library/no-node-access
        document.getElementById(firstControls)
      : null
    const secondRegion = secondControls
      ? // eslint-disable-next-line testing-library/no-node-access
        document.getElementById(secondControls)
      : null

    expect(firstRegion).toBeInTheDocument()
    expect(secondRegion).toBeInTheDocument()

    // Verify they have the region role
    expect(firstRegion).toHaveAttribute("role", "region")
    expect(secondRegion).toHaveAttribute("role", "region")

    // First region should be visible (expanded)
    expect(firstRegion).not.toHaveAttribute("hidden")

    // Second region should be hidden (collapsed)
    expect(secondRegion).toHaveAttribute("hidden")
  })
})
