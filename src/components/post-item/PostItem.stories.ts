import { PostItem } from "./PostItem"

import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/PostItem",
  component: PostItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof PostItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: {
      content: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr",
    },
    author: {
      avatar: {
        src: "./_mocks/image_text_placeholder.webp",
      },
      name: "Max Muster",
    },
    category: "Technology",
    content:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    date: "01. January 2024",
    image: {
      src: "./_mocks/image_text_placeholder.webp",
      alt: "Image alt",
      caption: "Image caption",
    },
    button: {
      title: "Read more",
    },
  },
}
