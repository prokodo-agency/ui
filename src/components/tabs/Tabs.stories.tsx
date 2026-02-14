import { useState } from "react"

import { Tabs } from "./Tabs"

import type { TabsProps } from "./Tabs.model"
import type { Meta, StoryObj } from "@storybook/react"

const defaultItems: TabsProps["items"] = [
  {
    value: "overview",
    label: "Overview",
    content:
      "Get a high-level summary with usage hints, release status, and key integration details.",
  },
  {
    value: "installation",
    label: "Installation",
    badge: "New",
    content:
      "Install via npm and configure credentials before first run. This panel can contain rich JSX content.",
  },
  {
    value: "changelog",
    label: "Changelog",
    content:
      "Review breaking changes, migration guidance, and recently shipped fixes for your integration.",
  },
]

const meta = {
  title: "prokodo/navigation/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Accessible tab navigation with island architecture, keyboard support (Arrow/Home/End/Enter/Space), and design-system styling.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
    activationMode: {
      control: "inline-radio",
      options: ["automatic", "manual"],
    },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
    ariaLabel: { control: "text" },
    className: { table: { disable: true } },
    listClassName: { table: { disable: true } },
    tabClassName: { table: { disable: true } },
    panelsClassName: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    items: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

function Playground(args: TabsProps) {
  const [value, setValue] = useState<string>(
    (args.defaultValue as string | undefined) ??
      (args.items?.[0]?.value as string | undefined) ??
      "",
  )

  return (
    <div style={{ maxWidth: 900, minWidth: 420, width: "72vw" }}>
      <Tabs
        {...args}
        value={value}
        onChange={event => {
          setValue(event.value)
        }}
      />
    </div>
  )
}

export const Default: Story = {
  args: {
    id: "tabs-default",
    ariaLabel: "Documentation sections",
    items: defaultItems,
    defaultValue: "overview",
    orientation: "horizontal",
    activationMode: "automatic",
  },
  render: args => <Playground {...args} />,
}

export const ManualActivation: Story = {
  args: {
    ...Default.args,
    id: "tabs-manual",
    activationMode: "manual",
  },
  render: args => <Playground {...args} />,
}

export const Vertical: Story = {
  args: {
    ...Default.args,
    id: "tabs-vertical",
    orientation: "vertical",
  },
  render: args => <Playground {...args} />,
}

export const WithDisabledTab: Story = {
  args: {
    ...Default.args,
    id: "tabs-disabled-item",
    items: [
      {
        value: "overview",
        label: "Overview",
        content:
          "Get a high-level summary with usage hints, release status, and key integration details.",
      },
      {
        value: "beta",
        label: "Beta",
        badge: "Soon",
        disabled: true,
        content:
          "This tab is intentionally disabled and should not be keyboard/selectable.",
      },
      {
        value: "changelog",
        label: "Changelog",
        content:
          "Review breaking changes, migration guidance, and recently shipped fixes for your integration.",
      },
    ],
  },
  render: args => <Playground {...args} />,
}

export const Disabled: Story = {
  args: {
    ...Default.args,
    id: "tabs-disabled",
    disabled: true,
  },
  render: args => <Playground {...args} />,
}

export const BadgeChipProps: Story = {
  args: {
    ...Default.args,
    id: "tabs-badge-chip-props",
    badgeChipProps: {
      color: "success",
      variant: "filled",
    },
    items: [
      {
        value: "overview",
        label: (
          <span>
            Overview <strong>Node</strong>
          </span>
        ),
        badge: "Live",
        content:
          "This tab uses a ReactNode label and global chip props (secondary + filled).",
      },
      {
        value: "installation",
        label: "Installation",
        badge: "Beta",
        badgeChipProps: {
          color: "warning",
          variant: "outlined",
        },
        content:
          "This tab overrides badge chip props per item (warning + outlined).",
      },
      {
        value: "changelog",
        label: "Changelog",
        content: "No badge for this tab.",
      },
    ],
  },
  render: args => <Playground {...args} />,
}
