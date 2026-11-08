import { useArgs } from "storybook/preview-api"
import { within, userEvent, expect, fn } from "storybook/test"

import { ICON_NAMES } from "../icon/IconList"

import { SideNav } from "./SideNav"

import type { SideNavProps } from "./SideNav.model"
import type { Meta, StoryObj } from "@storybook/react-vite"

/* ---------- meta ---------- */
const meta: Meta<typeof SideNav> = {
  title: "prokodo/navigation/Sidenav",
  component: SideNav,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    collapsed: {
      control: "boolean",
      description:
        "Controlled state; pair with onCollapsedChange. The owner handles persistence.",
    },
    onCollapsedChange: {
      control: false,
      description:
        "Requested next state from the built-in toggle, in either mode.",
    },
    collapsedIcon: { control: "select", options: ICON_NAMES },
    unCollapsedIcon: { control: "select", options: ICON_NAMES },
  },
  args: {
    ariaLabel: "Main navigation",
    initialCollapsed: false,
    items: [
      {
        label: "Dashboard",
        icon: { name: "AccessIcon" },
        redirect: { href: "#1", ariaLabel: "Dashboard" },
      },
      {
        label: "Leads",
        icon: { name: "UserAccountIcon" },
        redirect: { href: "#2", ariaLabel: "Leads" },
      },
      {
        label: "Settings",
        icon: { name: "Settings01Icon" },
        redirect: { href: "#3", ariaLabel: "Settings" },
      },
    ],
  },
}
export default meta

/* ---------- stories ---------- */
type Story = StoryObj<typeof SideNav>

export const Expanded: Story = {}

export const Collapsed: Story = {
  args: { initialCollapsed: true },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.hover(c.getByRole("navigation"))
  },
}

export const WithSections: Story = {
  args: {
    items: undefined,
    sections: [
      {
        headline: "General",
        description: "Core navigation",
        items: [
          {
            label: "Dashboard",
            icon: { name: "AccessIcon" },
            redirect: { href: "#1", ariaLabel: "Dashboard" },
            active: true,
          },
          {
            label: "Leads",
            icon: { name: "UserAccountIcon" },
            redirect: { href: "#2", ariaLabel: "Leads" },
          },
        ],
      },
      {
        headline: "Admin",
        items: [
          {
            label: "Settings",
            icon: { name: "Settings01Icon" },
            redirect: { href: "#3", ariaLabel: "Settings" },
          },
        ],
      },
    ],
  },
}

export const WithSectionsCollapsed: Story = {
  args: {
    initialCollapsed: true,
    items: undefined,
    sections: [
      {
        headline: "General",
        items: [
          {
            label: "Dashboard",
            icon: { name: "AccessIcon" },
            redirect: { href: "#1", ariaLabel: "Dashboard" },
            active: true,
          },
          {
            label: "Leads",
            icon: { name: "UserAccountIcon" },
            redirect: { href: "#2", ariaLabel: "Leads" },
          },
        ],
      },
      {
        headline: "Admin",
        items: [
          {
            label: "Settings",
            icon: { name: "Settings01Icon" },
            redirect: { href: "#3", ariaLabel: "Settings" },
          },
        ],
      },
    ],
  },
}

export const Controlled: Story = {
  args: {
    collapsed: false,
    onCollapsedChange: fn(),
    priority: true,
    renderFooter: () => <p>Application-owned navigation state</p>,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The application button, sidebar toggle and Storybook collapsed control share one state. SideNav does not access browser storage in controlled mode.",
      },
    },
  },
  render: function ControlledNavigation(args) {
    const [{ collapsed = false }, updateArgs] = useArgs<SideNavProps>()
    return (
      <div style={{ display: "flex", gap: 24 }}>
        <SideNav
          {...args}
          collapsed={collapsed}
          onCollapsedChange={next => {
            args.onCollapsedChange?.(next)
            updateArgs({ collapsed: next })
          }}
        />
        <div style={{ padding: 24 }}>
          <button
            aria-controls="sidenav"
            aria-expanded={!collapsed}
            style={{ minHeight: 44, minWidth: 44 }}
            type="button"
            onClick={() => updateArgs({ collapsed: !collapsed })}
          >
            Toggle from application
          </button>
          <p role="status">{collapsed ? "Collapsed" : "Expanded"}</p>
        </div>
      </div>
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    // The function-valued footer is stripped from the server fallback.
    await canvas.findByText("Application-owned navigation state")
    await userEvent.click(
      canvas.getByRole("button", { name: "Toggle from application" }),
    )
    await expect(
      await canvas.findByRole("button", { name: "Expand menu" }),
    ).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(
      await canvas.findByRole("button", { name: "Expand menu" }),
    )
    await expect(args.onCollapsedChange).toHaveBeenCalledWith(false)
    await expect(
      await canvas.findByRole("button", { name: "Collapse menu" }),
    ).toHaveAttribute("aria-expanded", "true")
  },
}
