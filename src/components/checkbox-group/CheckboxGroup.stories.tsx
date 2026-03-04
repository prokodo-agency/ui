import { useState, type ComponentProps } from "react"

import { CheckboxGroup } from "./CheckboxGroup"

import type { Meta, StoryObj } from "@storybook/react-vite"

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
    color: {
      options: [
        "primary",
        "secondary",
        "success",
        "warning",
        "error",
        "info",
        "white",
        "inherit",
      ],
      control: { type: "select" },
      defaultValue: "primary",
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

const renderWithState = (initial: string[] = []) => {
  const CheckboxGroupWithState = (
    args: ComponentProps<typeof CheckboxGroup>,
  ) => {
    const [values, setValues] = useState<string[]>(initial)
    return (
      <CheckboxGroup
        {...args}
        values={values}
        onChange={next => setValues(next as string[])}
      />
    )
  }
  CheckboxGroupWithState.displayName = "CheckboxGroupWithState"
  return CheckboxGroupWithState
}

export const Default: Story = {
  render: renderWithState(),
  args: {
    name: "preferences",
    legend: "Notification preferences",
    options: [...options],
    variant: "plain",
    layout: "stack",
  },
}

export const GridPlain: Story = {
  render: renderWithState(),
  args: {
    name: "preferences-grid",
    legend: "Notification preferences",
    options: [...options],
    variant: "plain",
    layout: "grid",
  },
}

export const Required: Story = {
  render: renderWithState(),
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
  render: renderWithState(),
  args: {
    name: "preferences-option-required",
    legend: "Notification preferences",
    options: [{ ...options[0], required: true }, ...options.slice(1)],
    variant: "plain",
    layout: "stack",
  },
}

export const CardGroup: Story = {
  render: renderWithState(["newsletter"]),
  args: {
    name: "preferences-card",
    legend: "Notification preferences",
    options: [...options],
    variant: "card",
    color: "primary",
    layout: "stack",
  },
}

export const SuccessCard: Story = {
  render: renderWithState(),
  args: {
    name: "preferences-success",
    legend: "Feature flags",
    options: [...options],
    variant: "card",
    color: "success",
    layout: "grid",
  },
}
