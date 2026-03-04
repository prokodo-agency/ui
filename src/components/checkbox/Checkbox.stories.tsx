/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react"

import { Checkbox } from "./Checkbox"

import type { Meta, StoryObj } from "@storybook/react-vite"

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
    disabled: { control: { type: "boolean" } },
    required: { control: { type: "boolean" } },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => {
    const [checked, setChecked] = useState(false)
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={(_, next) => setChecked(next)}
      />
    )
  },
  args: {
    name: "checkbox-default",
    value: "newsletter",
    title: "I want to receive updates",
    variant: "plain",
  },
}

export const WithDescription: Story = {
  render: args => {
    const [checked, setChecked] = useState(false)
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={(_, next) => setChecked(next)}
      />
    )
  },
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

export const Required: Story = {
  render: args => {
    const [checked, setChecked] = useState(false)
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={(_, next) => setChecked(next)}
      />
    )
  },
  args: {
    name: "checkbox-required",
    value: "terms",
    title: "Accept Terms",
    description: "This option is required before continuing.",
    required: true,
    variant: "plain",
  },
}

export const CardVariant: Story = {
  render: args => {
    const [checked, setChecked] = useState(false)
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={(_, next) => setChecked(next)}
      />
    )
  },
  args: {
    name: "checkbox-card",
    value: "newsletter",
    title: "Subscribe to newsletter",
    description: "Weekly product updates, no spam.",
    variant: "card",
    color: "primary",
  },
}

export const AllColorVariants: Story = {
  render: () => {
    const [checked, setChecked] = useState<Record<string, boolean>>({})
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          minWidth: "320px",
        }}
      >
        {(["primary", "secondary", "success", "warning", "error"] as const).map(
          cv => (
            <Checkbox
              key={cv}
              checked={checked[cv] ?? false}
              color={cv}
              description={`${checked[cv] ? "Checked" : "Unchecked"} — ${cv} variant`}
              name={`cv-${cv}`}
              title={`${cv.charAt(0).toUpperCase() + cv.slice(1)} variant`}
              value={cv}
              variant="plain"
              onChange={(_, next) =>
                setChecked(prev => ({ ...prev, [cv]: next }))
              }
            />
          ),
        )}
      </div>
    )
  },
  args: {
    name: "all-color-variants",
    value: "placeholder",
    title: "Color variants",
  },
}
