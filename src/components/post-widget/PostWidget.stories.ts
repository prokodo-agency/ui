import { PostWidget } from "./PostWidget"

import type { PostWidgetItem } from "./PostWidget.model"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/blog/PostWidget",
  component: PostWidget,
  parameters: {
    layout: "centered",
  },
  tags: ["experimental"],
  argTypes: {},
} satisfies Meta<typeof PostWidget>

export default meta
type Story = StoryObj<typeof meta>

const items = [
  {
    image: {
      src: "/assets/images/placeholder_60x60.webp",
      alt: "Cover",
    },
    title: {
      content: "Article",
    },
    category: "Category",
    date: "23. Jan 2024",
    redirect: {
      href: "#",
    },
  },
  {
    image: {
      src: "/assets/images/placeholder_60x60.webp",
      alt: "Cover",
    },
    title: {
      content: "Article",
    },
    category: "Category",
    date: "23. Jan 2024",
    redirect: {
      href: "#",
    },
  },
  {
    image: {
      src: "/assets/images/placeholder_60x60.webp",
      alt: "Cover",
    },
    title: {
      content: "Article",
    },
    category: "Category",
    date: "23. Jan 2024",
    redirect: {
      href: "#",
    },
  },
] as PostWidgetItem[]

export const Default: Story = {
  args: {
    title: {
      content: "Most popular",
    },
    items,
  },
}

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    title: {
      content: "Most popular",
    },
    items,
  },
}
