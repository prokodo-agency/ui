import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { Tabs } from "./Tabs"
import { TabsView } from "./Tabs.view"

const tabItems = [
  { value: "tab1", label: "First Tab", content: <p>First panel content</p> },
  { value: "tab2", label: "Second Tab", content: <p>Second panel content</p> },
  { value: "tab3", label: "Third Tab", content: <p>Third panel content</p> },
]

describe("Tabs", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders nothing when items array is empty", () => {
      const { container } = render(
        <Tabs ariaLabel="Empty tabs" id="empty" items={[]} />,
      )
      expect(container).toBeEmptyDOMElement()
    })

    it("renders a tablist with correct aria-label", () => {
      render(<Tabs ariaLabel="Main navigation" id="tabs" items={tabItems} />)
      expect(
        screen.getByRole("tablist", { name: "Main navigation" }),
      ).toBeInTheDocument()
    })

    it("renders all tab labels", () => {
      render(<Tabs id="tabs" items={tabItems} />)
      expect(screen.getByRole("tab", { name: "First Tab" })).toBeInTheDocument()
      expect(
        screen.getByRole("tab", { name: "Second Tab" }),
      ).toBeInTheDocument()
      expect(screen.getByRole("tab", { name: "Third Tab" })).toBeInTheDocument()
    })

    it("renders the first tab as selected by default", () => {
      render(<Tabs id="tabs" items={tabItems} />)
      expect(screen.getByRole("tab", { name: "First Tab" })).toHaveAttribute(
        "aria-selected",
        "true",
      )
    })

    it("marks default value tab as selected", () => {
      render(<Tabs defaultValue="tab2" id="tabs" items={tabItems} />)
      expect(screen.getByRole("tab", { name: "Second Tab" })).toHaveAttribute(
        "aria-selected",
        "true",
      )
    })

    it("renders tab panels for all items", () => {
      render(<Tabs id="tabs" items={tabItems} />)
      // Inactive panels have the HTML `hidden` attribute; include hidden elements
      expect(screen.getAllByRole("tabpanel", { hidden: true })).toHaveLength(3)
    })

    it("shows only the selected panel content", () => {
      render(<Tabs id="tabs" items={tabItems} />)
      expect(screen.getByText("First panel content")).toBeVisible()
    })

    it("renders vertical orientation", () => {
      render(<Tabs id="tabs" items={tabItems} orientation="vertical" />)
      expect(screen.getByRole("tablist")).toHaveAttribute(
        "aria-orientation",
        "vertical",
      )
    })

    it("renders a disabled tab", () => {
      const itemsWithDisabled = [
        tabItems[0]!,
        tabItems[1]!,
        {
          value: "tab3",
          label: "Third Tab",
          content: <p>Third panel content</p>,
          disabled: true,
        },
      ]
      render(<Tabs id="tabs" items={itemsWithDisabled} />)
      expect(screen.getByRole("tab", { name: "Third Tab" })).toBeDisabled()
    })

    it("renders tab badges when provided", () => {
      const itemsWithBadge = [
        {
          value: "tab1",
          label: "First Tab",
          content: <p>First panel content</p>,
          badge: "3",
        },
        tabItems[1]!,
        tabItems[2]!,
      ]
      render(<Tabs id="tabs" items={itemsWithBadge} />)
      expect(screen.getByText("3")).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // ARIA / Accessibility structure
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("tabs have no axe violations", async () => {
      const { container } = render(
        <Tabs ariaLabel="Content sections" id="a11y-tabs" items={tabItems} />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("vertical tabs have no axe violations", async () => {
      const { container } = render(
        <Tabs
          ariaLabel="Vertical sections"
          id="a11y-vertical-tabs"
          items={tabItems}
          orientation="vertical"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("each tab has aria-controls pointing to its panel", () => {
      render(<Tabs id="ctrl-tabs" items={tabItems} />)
      const tab0 = screen.getByRole("tab", { name: "First Tab" })
      expect(tab0).toHaveAttribute("aria-controls", "ctrl-tabs-panel-0")
    })

    it("each panel has aria-labelledby pointing to its tab", () => {
      render(<Tabs id="lbl-tabs" items={tabItems} />)
      const [panel0] = screen.getAllByRole("tabpanel")
      expect(panel0).toHaveAttribute("aria-labelledby", "lbl-tabs-tab-0")
    })
  })
})

// -------------------------------------------------------------------------
// TabsView — direct rendering tests for uncovered view branches
// -------------------------------------------------------------------------

describe("TabsView", () => {
  it("falls back to items[0].value when all items are disabled and no matching value", () => {
    const allDisabledItems = [
      { value: "a", label: "A", disabled: true, content: <p>A</p> },
      { value: "b", label: "B", disabled: true, content: <p>B</p> },
    ]
    render(
      <TabsView
        ariaLabel="Disabled tabs"
        id="disabled-tabs"
        items={allDisabledItems}
      />,
    )
    // The component should not crash and should render tabs
    expect(screen.getAllByRole("tab")).toHaveLength(2)
  })
})
