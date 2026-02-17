import { useState } from "react"

import { CheckboxGroup } from "./CheckboxGroup"

import type { Meta, StoryObj } from "@storybook/react"

const options = [
  {
    value: "newsletter",
    title: "Newsletter",
    description: "Product updates and release notes",
  },
  {
    value: "security",
    title: "Security alerts",
    description: "Critical incidents and vulnerability advisories",
    icon: { name: "Alert01Icon", size: "sm" },
    iconLabel: "Important option",
  },
  {
    value: "research",
    title: "Research program",
    description: "Early features and private beta invitations",
  },
] as const

const meta = {
  title: "prokodo/form/CheckboxGroup",
  component: CheckboxGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["plain", "card"],
      control: { type: "select" },
    },
    layout: {
      options: ["stack", "grid"],
      control: { type: "select" },
    },
    required: { control: { type: "boolean" } },
  },
} satisfies Meta<typeof CheckboxGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: "preferences",
    legend: "Notification preferences",
    options: [...options],
    variant: "plain",
    layout: "stack",
  },
}

/* eslint react-hooks/rules-of-hooks: 0 */
export const Controlled: Story = {
  args: {
    name: "preferences-controlled",
    legend: "Notification preferences",
    options: [...options],
    variant: "plain",
  },
  render: () => {
    const [values, setValues] = useState<string[]>(["newsletter"])

    return (
      <CheckboxGroup
        legend="Notification preferences"
        name="preferences-controlled"
        options={[...options]}
        values={values}
        variant="plain"
        onChange={setValues}
      />
    )
  },
}

export const GridPlain: Story = {
  args: {
    name: "preferences-grid",
    legend: "Notification preferences",
    options: [...options],
    variant: "plain",
    layout: "grid",
  },
}

export const Required: Story = {
  args: {
    name: "preferences-required",
    legend: "Notification preferences",
    options: [...options],
    required: true,
    variant: "plain",
    layout: "stack",
  },
}

export const OptionRequired: Story = {
  args: {
    name: "preferences-option-required",
    legend: "Notification preferences",
    options: [{ ...options[0], required: true }, ...options.slice(1)],
    variant: "plain",
    layout: "stack",
  },
}
