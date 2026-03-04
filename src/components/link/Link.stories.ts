import { Link } from "./Link"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "prokodo/navigation/Link",
  component: Link,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
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
    color: "primary",
    href: "/",
    children: "Follow me",
  },
}
