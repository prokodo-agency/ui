import { Chip } from "@/components/chip"

import type { Meta, StoryObj } from "@storybook/react"

/* ---------- Meta ----------------------------------------- */
const meta = {
  title: "prokodo/common/Chip",
  component: Chip,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: ["filled", "outlined"],
    },
    color: {
      control: "radio",
      options: [
        "inherit",
        "primary",
        "secondary",
        "success",
        "error",
        "info",
        "warning",
        "white"
      ],
    },
    /* hide styling helpers */
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Default chip",
  },
}

export const Clickable: Story = {
  args: {
    label: "Click me",
    onClick: () => alert("chip clicked"),
    color: "success",
  },
}

export const Deletable: Story = {
  args: {
    label: "Removable chip",
    onDelete: () => alert("delete pressed"),
    variant: "outlined",
    color: "error",
  },
}
