import { Link } from "./Link"

import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/Link",
  component: Link,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: [
        "base",
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "error",
        "white",
      ],
      control: { type: "radio" },
    },
  },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: "primary",
    href: "/",
    children: "Follow me",
  },
}
