import { ImageText } from "./ImageText"

import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/ImageText",
  component: ImageText,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    reverse: {
      options: [true, false],
      control: { type: "radio" },
      defaultValue: false,
    },
  },
} satisfies Meta<typeof ImageText>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    subTitle: "How can our product help you?",
    title: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr",
    content:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    image: {
      src: "./_mocks/placeholder_400x600.webp",
      alt: "Image alt",
      caption: "Image caption",
    },
  },
}
