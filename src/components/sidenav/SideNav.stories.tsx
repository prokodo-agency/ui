import { within, userEvent } from "@storybook/test"

import { ICON_NAMES } from "../icon/IconList"

import { SideNav } from "./SideNav"

import type { Meta, StoryObj } from "@storybook/react"

/* ---------- meta ---------- */
const meta: Meta<typeof SideNav> = {
  title: "prokodo/navigation/Sidenav",
  component: SideNav,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
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
        redirect: { href: "#1" },
      },
      {
        label: "Leads",
        icon: { name: "UserAccountIcon" },
        redirect: { href: "#2" },
      },
      {
        label: "Settings",
        icon: { name: "Settings01Icon" },
        redirect: { href: "#3" },
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
