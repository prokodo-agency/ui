import { useState } from "react"

import { Switch } from "./Switch"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "prokodo/form/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
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
    color: "primary",
    name: "switch-1",
  },
  render: args => {
    const [checked, setChecked] = useState(false)
    return (
      <Switch
        {...args}
        checked={checked}
        onChange={() => setChecked(v => !v)}
      />
    )
  },
}

export const WithLabel: Story = {
  args: {
    color: "primary",
    label: "Change me",
    name: "switch-2",
  },
  render: args => {
    const [checked, setChecked] = useState(false)
    return (
      <Switch
        {...args}
        checked={checked}
        onChange={() => setChecked(v => !v)}
      />
    )
  },
}

/* eslint react-hooks/rules-of-hooks: 0 */
export const WithIcon: Story = {
  args: {
    color: "primary",
    icon: "CancelCircleIcon",
    name: "switch-3",
    checkedIcon: "Tick03Icon",
  },
  render: args => {
    const [open, setOpen] = useState(false)
    return <Switch {...args} checked={open} onChange={() => setOpen(!open)} />
  },
}
