import { ProgressBar } from "./ProgressBar"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "prokodo/feedback/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
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
  },
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    id: "example-progress",
    value: 60,
    label: "Uploading… 60%",
  },
}

export const Primary: Story = {
  args: { id: "primary", value: 75, color: "primary" },
}

export const Success: Story = {
  args: { id: "success", value: 100, color: "success", label: "Complete" },
}

export const Error: Story = {
  args: { id: "error", value: 30, color: "error", label: "Failed… 30%" },
}

export const Warning: Story = {
  args: {
    id: "warning",
    value: 55,
    color: "warning",
    label: "Processing… 55%",
  },
}

export const Info: Story = {
  args: { id: "info", value: 40, color: "info", label: "Syncing… 40%" },
}

export const Indeterminate: Story = {
  args: { id: "indeterminate", infinity: true, animated: true },
}
