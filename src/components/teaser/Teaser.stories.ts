import { Teaser } from "./Teaser"

import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/Teaser",
  component: Teaser,
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
        "success",
        "info",
        "warning",
        "error",
        "white",
      ],
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof Teaser>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    image: {
      src: "./images/card_background_primary_1.webp",
      alt: "Image alt",
      caption: "Image caption",
    },
    title: {
      content: "Lorem ipsum dolar sit amet",
    },
    content: "Lorem ipsum dolar sit amet and more promo content",
  },
}

export const Animated: Story = {
  args: {
    animation:
      "https://lottie.host/9be763fe-a1be-4789-9e0c-326aa1da26fd/DBJJo3oKXj.lottie",
    title: {
      content: "Lorem ipsum dolar sit amet",
    },
    content: "Lorem ipsum dolar sit amet and more promo content",
  },
}
