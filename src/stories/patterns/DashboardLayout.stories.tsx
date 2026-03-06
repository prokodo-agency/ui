import { Headline } from "@/components/headline"
import { RichText } from "@/components/rich-text"
import { SideNav } from "@/components/sidenav"
import { Tabs } from "@/components/tabs"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "prokodo/patterns/DashboardLayout",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A persistent sidebar + tab navigation shell for SaaS and admin apps. " +
          "Combines `SideNav` and `Tabs` in the App Router layout pattern.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function DashboardLayoutDemo() {
  return (
    <div style={{ display: "flex", height: "500px" }}>
      <SideNav
        ariaLabel="Main navigation"
        items={[
          {
            label: "Overview",
            icon: { name: "AccessIcon" },
            redirect: { href: "#" },
          },
          {
            label: "Analytics",
            icon: { name: "BarChartIcon" },
            redirect: { href: "#" },
            active: true,
          },
          {
            label: "Settings",
            icon: { name: "Settings01Icon" },
            redirect: { href: "#" },
          },
        ]}
      />
      <main
        style={{
          flex: 1,
          padding: "2rem",
          overflowY: "auto",
        }}
      >
        <Headline style={{ marginTop: 0 }} type="h1">
          Analytics
        </Headline>
        <div style={{ marginTop: "1.5rem" }}>
          <Tabs
            ariaLabel="Analytics sections"
            defaultValue="traffic"
            id="pattern-dashboard-tabs"
            items={[
              {
                value: "traffic",
                label: "Traffic",
                content: (
                  <RichText style={{ padding: "1rem 0" }}>
                    Traffic panel — page views, sessions, and top sources.
                  </RichText>
                ),
              },
              {
                value: "conversion",
                label: "Conversion",
                content: (
                  <RichText style={{ padding: "1rem 0" }}>
                    Conversion panel — funnel steps and goal completions.
                  </RichText>
                ),
              },
              {
                value: "revenue",
                label: "Revenue",
                content: (
                  <RichText style={{ padding: "1rem 0" }}>
                    Revenue panel — MRR, ARR, and churn breakdown.
                  </RichText>
                ),
              },
            ]}
          />
        </div>
      </main>
    </div>
  )
}

export const Default: Story = {
  render: () => <DashboardLayoutDemo />,
}

export const Collapsed: Story = {
  render: () => (
    <div style={{ display: "flex", height: "500px" }}>
      <SideNav
        initialCollapsed
        ariaLabel="Main navigation"
        items={[
          {
            label: "Overview",
            icon: { name: "AccessIcon" },
            redirect: { href: "#" },
          },
          {
            label: "Analytics",
            icon: { name: "BarChartIcon" },
            redirect: { href: "#" },
            active: true,
          },
          {
            label: "Settings",
            icon: { name: "Settings01Icon" },
            redirect: { href: "#" },
          },
        ]}
      />
      <main
        style={{
          flex: 1,
          padding: "2rem",
        }}
      >
        <Headline style={{ marginTop: 0 }} type="h1">
          Analytics
        </Headline>
        <RichText>
          Sidebar starts collapsed. Hover or click the toggle to expand.
        </RichText>
      </main>
    </div>
  ),
}
