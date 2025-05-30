import { PostWidgetCarousel } from "./PostWidgetCarousel"

import type { PostWidgetCarouselItem } from "./PostWidgetCarousel.model"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/PostWidgetCarousel",
  component: PostWidgetCarousel,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: [
        "inherit",
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
} satisfies Meta<typeof PostWidgetCarousel>

export default meta
type Story = StoryObj<typeof meta>

const items = [
  {
    image: {
      src: "./_mocks/placeholder.jpeg",
      alt: "Cover",
    },
    title: {
      content: "Technology",
    },
    redirect: {
      href: "#",
    },
  },
  {
    image: {
      src: "./_mocks/placeholder.jpeg",
      alt: "Cover",
    },
    title: {
      content: "App",
    },
    redirect: {
      href: "#",
    },
  },
  {
    image: {
      src: "./_mocks/placeholder.jpeg",
      alt: "Cover",
    },
    title: {
      content: "Internal",
    },
    redirect: {
      href: "#",
    },
  },
] as PostWidgetCarouselItem[]

export const Default: Story = {
  args: {
    title: {
      content: "Categories",
    },
    items,
  },
}
