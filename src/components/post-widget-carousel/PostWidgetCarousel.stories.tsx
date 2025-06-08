import { PostWidgetCarousel } from "./PostWidgetCarousel"

import type { PostWidgetCarouselItem } from "./PostWidgetCarousel.model"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/🚧 Experimental/blog/PostWidgetCarousel",
  component: PostWidgetCarousel,
  parameters: {
    layout: "centered",
  },
  tags: ["experimental"],
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
      src: "/assets/images/placeholder_1000x230.webp",
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
      src: "/assets/images/placeholder_1000x230.webp",
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
      src: "/assets/images/placeholder_1000x230.webp",
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
