import { Chip } from "./Chip"

import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/Chip",
  component: Chip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["filled", "outlined"],
      control: { type: "select" },
    },
    color: {
      options: [
        "inherit",
        "default",
        "primary",
        "secondary",
        "error",
        "info",
        "success",
        "warning",
        "white",
      ],
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Chip",
  },
}
