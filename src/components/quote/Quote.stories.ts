import { Quote } from "./Quote"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "prokodo/content/Quote",
  component: Quote,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
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
      description:
        "Color token applied to sub-headline, avatar, and card border.",
      table: { defaultValue: { summary: "primary" } },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Quote>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    content:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    author: {
      name: "Max Muster",
      position: "CEO & Founder of example company",
    },
  },
}

export const WithAvatar: Story = {
  args: {
    content:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    author: {
      avatar: {
        image: {
          src: "/assets/images/placeholder_60x60.webp",
          alt: "Image alt",
        },
      },
      name: "Max Muster",
      position: "CEO & Founder of example company",
    },
  },
}

export const WithTitle: Story = {
  args: {
    subTitle: {
      content: "How can our product help you?",
    },
    title: {
      content: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr",
    },
    content:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    author: {
      avatar: {
        image: {
          src: "/assets/images/placeholder_60x60.webp",
          alt: "Image alt",
        },
      },
      name: "Max Muster",
      position: "CEO & Founder of example company",
    },
  },
}
