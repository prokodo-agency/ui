import { useState } from "react"

import { Switch } from "./Switch"

import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/form/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: [
        "inherit",
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "error",
      ],
      control: { type: "select" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: "primary",
    name: "switch-1",
  },
}

export const WithLabel: Story = {
  args: {
    variant: "primary",
    label: "Change me",
    name: "switch-2",
  },
}

/* eslint react-hooks/rules-of-hooks: 0 */
export const WithIcon: Story = {
  args: {
    variant: "primary",
    icon: "CancelCircleIcon",
    name: "switch-3",
    checkedIcon: "Tick03Icon",
  },
  render: args => {
    const [open, setOpen] = useState(false)
    return <Switch {...args} checked={open} onChange={() => setOpen(!open)} />
  },
}
