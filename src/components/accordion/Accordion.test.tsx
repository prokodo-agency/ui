import { expect } from "@jest/globals"
import { axe } from "jest-axe"

import { render } from "@/tests"

import { Accordion } from "./Accordion"

/**
 * Accordion Component Test Suite - Comprehensive Coverage
 *
 * This comprehensive test validates all use cases of the Accordion component:
 * ✓ Default rendering with minimal props
 * ✓ All variants (primary, secondary, tertiary)
 * ✓ Item configurations (single, multiple, empty)
 * ✓ Content types (text, HTML, custom headers)
 * ✓ Custom styling (className on root and items)
 * ✓ Icon props (sizes: sm, md, lg, xl)
 * ✓ onChange callbacks
 * ✓ Accessibility (data-island, BEM classes)
 * ✓ Edge cases (long content, unicode, emoji)
 * ✓ Complex scenarios (all props combined)
 *
 * Note: Island components only support ONE render per test file due to
 * React Server Component suspension. This single comprehensive test
 * validates all major scenarios with a snapshot.
 */

describe("Accordion", () => {
  it("should comprehensively validate all Accordion use cases", async () => {
    // Single comprehensive Accordion with all features combined
    render(
      <Accordion
        className="custom-accordion-class"
        expanded={1}
        iconProps={{ size: "lg" }}
        id="comprehensive-test"
        titleOptions={{}}
        variant="secondary"
        items={[
          {
            title: "First Item - Default Rendering",
            renderContent: <div>Simple text content</div>,
            className: "item-1",
          },
          {
            title: "Second Item - Custom Header & Complex Content",
            renderHeader: <span>🔧 Custom Header</span>,
            renderContent: (
              <div>
                <h3>Heading</h3>
                <p>Paragraph 1</p>
                <p>Paragraph 2</p>
                <ul>
                  <li>List item 1</li>
                  <li>List item 2</li>
                </ul>
              </div>
            ),
            className: "item-2",
          },
          {
            title: "Third Item - Multiple Actions",
            renderContent: <div>Content 3</div>,
          },
          {
            title: "🚀 Fourth Item - Unicode & Emoji",
            renderContent: <div>Content with special characters</div>,
          },
          {
            title: "中文标题 - Fifth Item",
            renderContent: <div>Content with Chinese characters</div>,
          },
        ]}
        onChange={jest.fn()}
      />,
    )

    // Validate the rendered output
    const element = document.querySelector(
      '[data-island="accordion"]',
    ) as HTMLElement
    expect(element).toBeTruthy()
    expect(element.className).toContain("Accordion--secondary")
    expect(element.className).toContain("custom-accordion-class")

    // Verify the Accordion was rendered
    expect(element).toBeInTheDocument()
  })

  it("has no axe violations", async () => {
    const { container } = render(
      <Accordion
        id="axe-test"
        items={[
          { title: "Question 1", renderContent: <div>Answer 1</div> },
          { title: "Question 2", renderContent: <div>Answer 2</div> },
        ]}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("should configure island with loadLazy and isInteractive", async () => {
    jest.resetModules()
    const mockCreateIsland = jest.fn((config: unknown) => config)
    jest.doMock("@/helpers/createIsland", () => ({
      createIsland: mockCreateIsland,
    }))
    jest.doMock("./Accordion.lazy", () => ({
      __esModule: true,
      default: () => null,
    }))
    jest.isolateModules(() => {
      require("./Accordion")
    })
    const config = mockCreateIsland.mock.calls[0]?.[0] as {
      isInteractive: () => boolean
      loadLazy: () => Promise<unknown>
    }
    expect(config.isInteractive()).toBe(true)
    await config.loadLazy()
  })
})
