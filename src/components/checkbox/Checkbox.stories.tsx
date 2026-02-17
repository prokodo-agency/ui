import { useState } from "react"

import { Checkbox } from "./Checkbox"

import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/form/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["plain", "card"],
      control: { type: "select" },
    },
    disabled: { control: { type: "boolean" } },
    required: { control: { type: "boolean" } },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: "checkbox-default",
    value: "newsletter",
    title: "I want to receive updates",
    variant: "plain",
  },
}

export const WithDescription: Story = {
  args: {
    name: "checkbox-desc",
    value: "terms",
    title: "Accept Terms",
    description: "Required to continue onboarding.",
    icon: { name: "Alert01Icon", size: "sm" },
    iconLabel: "Required option",
    variant: "plain",
  },
}

/* eslint react-hooks/rules-of-hooks: 0 */
export const Controlled: Story = {
  args: {
    name: "checkbox-controlled",
    value: "pro",
    title: "Enable pro features",
    variant: "plain",
  },
  render: args => {
    const [checked, setChecked] = useState(false)
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={(_, nextChecked) => setChecked(nextChecked)}
      />
    )
  },
}

export const Required: Story = {
  args: {
    name: "checkbox-required",
    value: "terms",
    title: "Accept Terms",
    description: "This option is required before continuing.",
    required: true,
    variant: "plain",
  },
}
