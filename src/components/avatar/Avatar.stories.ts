import { Avatar } from "./Avatar"

import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ["xs", "sm", "md", "lg", "xl"],
      control: { type: "select" },
    },
    variant: {
      options: [
        "inherit",
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "error",
        "white",
      ],
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithImage: Story = {
  args: {
    image: {
      src: "./_mocks/placeholder.jpeg",
      alt: "Avatar",
    },
  },
}

export const WithLink: Story = {
  args: {
    image: {
      src: "./_mocks/placeholder.jpeg",
      alt: "Avatar",
    },
    redirect: {
      href: "#",
    },
  },
}
