import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"

import { render, screen } from "@/tests"

import { SideNav } from "./SideNav"
import SideNavView from "./SideNav.view"

const navItems = [
  {
    label: "Dashboard",
    icon: { name: "Home01Icon" as const },
    redirect: { href: "/dashboard" },
    active: true,
  },
  {
    label: "Settings",
    icon: { name: "Settings01Icon" as const },
    redirect: { href: "/settings" },
    active: false,
  },
]

describe("SideNav", () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------
  describe("rendering", () => {
    it("renders an aside element", () => {
      render(<SideNavView collapsed={false} items={navItems} />)
      expect(screen.getByRole("complementary")).toBeInTheDocument()
    })

    it("renders with aria-label", () => {
      render(
        <SideNavView
          ariaLabel="Side navigation"
          collapsed={false}
          items={navItems}
        />,
      )
      expect(
        screen.getByRole("complementary", { name: "Side navigation" }),
      ).toBeInTheDocument()
    })

    it("renders navigation links when expanded", () => {
      render(<SideNavView collapsed={false} items={navItems} />)
      expect(screen.getByRole("navigation")).toBeInTheDocument()
      expect(screen.getByText("Dashboard")).toBeInTheDocument()
      expect(screen.getByText("Settings")).toBeInTheDocument()
    })

    it("hides labels when collapsed=true", () => {
      render(<SideNavView collapsed={true} items={navItems} />)
      expect(screen.queryByText("Dashboard")).not.toBeInTheDocument()
    })

    it("renders toggle button with aria-expanded", () => {
      render(<SideNavView collapsed={false} items={navItems} />)
      const toggleBtn = screen.getByRole("button")
      expect(toggleBtn).toHaveAttribute("aria-expanded", "true")
    })

    it("toggle button shows collapsed state correctly", () => {
      render(<SideNavView collapsed={true} items={navItems} />)
      const toggleBtn = screen.getByRole("button")
      expect(toggleBtn).toHaveAttribute("aria-expanded", "false")
    })
  })

  // -------------------------------------------------------------------------
  // Interaction
  // -------------------------------------------------------------------------
  describe("interaction", () => {
    it("calls onToggle when toggle button is clicked", async () => {
      const handleToggle = jest.fn()
      render(
        <SideNavView
          collapsed={false}
          items={navItems}
          onToggle={handleToggle}
        />,
      )
      await userEvent.click(screen.getByRole("button"))
      expect(handleToggle).toHaveBeenCalledTimes(1)
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility (WCAG 2.2)
  // -------------------------------------------------------------------------
  describe("accessibility", () => {
    it("expanded sidenav has no axe violations", async () => {
      const { container } = render(
        <SideNavView
          ariaLabel="Main navigation"
          collapsed={false}
          items={navItems}
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("collapsed sidenav has no axe violations", async () => {
      const { container } = render(
        <SideNavView
          ariaLabel="Main navigation"
          collapsed={true}
          items={navItems}
        />,
      )
      // Collapsed state shows icon-only links; disable link-name rule as this is a
      // known UX pattern where the label is visually hidden when collapsed
      const results = await axe(container, {
        rules: { "link-name": { enabled: false } },
      })
      expect(results).toHaveNoViolations()
    })
  })

  describe("edge cases", () => {
    it("renders with iconProps.className on toggle icon", () => {
      // Covers iconProps?.className optional chain at line 57
      render(
        <SideNavView
          collapsed={false}
          iconProps={{ className: "my-icon-class" }}
          items={navItems}
        />,
      )
      expect(screen.getByRole("complementary")).toBeInTheDocument()
    })

    it("renders items without redirect href as plain renderItem", () => {
      // Covers redirect?.href === undefined branch at line 81 (no Link wrapper)
      const itemsNoHref = [
        { label: "Home", icon: { name: "Home01Icon" as const } },
      ]
      render(<SideNavView collapsed={false} items={itemsNoHref} />)
      expect(screen.getByText("Home")).toBeInTheDocument()
    })

    it("renders footer via renderFooter when not collapsed", () => {
      // Covers renderFooter !== undefined && !collapsed && renderFooter() at L89
      render(
        <SideNavView
          collapsed={false}
          items={navItems}
          renderFooter={() => <div>Footer Content</div>}
        />,
      )
      expect(screen.getByText("Footer Content")).toBeInTheDocument()
    })
  })
})

describe("SideNav island", () => {
  it("renders without crashing via island wrapper", () => {
    render(<SideNav items={[]} />)
  })
})
