import { ImageText } from "./ImageText"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "prokodo/layout/ImageText",
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

const PLACEHOLDER_IMAGE = {
  src: "/assets/images/placeholder_400x600.webp",
  alt: "Image alt",
  caption: "Image caption",
}

const LOREM =
  "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."

export const Default: Story = {
  args: {
    subTitle: "How can our product help you?",
    title: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr",
    content: LOREM + " " + LOREM,
    image: PLACEHOLDER_IMAGE,
  },
}

export const Reversed: Story = {
  args: {
    subTitle: "Reversed layout",
    title: "Image on the right, content on the left",
    content: LOREM,
    image: PLACEHOLDER_IMAGE,
    reverse: true,
  },
}

export const WithButton: Story = {
  args: {
    subTitle: "Ready to get started?",
    title: "Explore our features and take the next step",
    content: LOREM,
    image: PLACEHOLDER_IMAGE,
    button: {
      title: "Learn more",
      redirect: { href: "#" },
    },
  },
}

export const ReversedWithButton: Story = {
  args: {
    subTitle: "Action on the left",
    title: "Reversed layout with a call-to-action button",
    content: LOREM,
    image: PLACEHOLDER_IMAGE,
    reverse: true,
    button: {
      title: "Get started",
      redirect: { href: "#" },
    },
  },
}

export const ContentOnly: Story = {
  args: {
    subTitle: "No image needed",
    title: "Full-width text block without an image",
    content: LOREM + " " + LOREM,
  },
}

export const WithAnimatedBorder: Story = {
  args: {
    subTitle: "Animated border accent",
    title: "Decorative animated border on the side",
    content: LOREM,
    image: PLACEHOLDER_IMAGE,
    animatedBorder: {
      direction: "top-to-bottom",
    },
  },
}
