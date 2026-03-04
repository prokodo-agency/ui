import { PostTeaser } from "./PostTeaser"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "prokodo/content/PostTeaser",
  component: PostTeaser,
  parameters: {
    layout: "centered",
  },
  tags: ["experimental"],
  argTypes: {
    hideCategory: {
      control: { type: "boolean" },
    },
    color: {
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
} satisfies Meta<typeof PostTeaser>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    locale: "de-DE",
    image: {
      src: "/assets/images/placeholder_1000x230.webp",
      alt: "Cover",
    },
    title: {
      content: "Article",
    },
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    category: "Category",
    date: "23. Jan 2024",
    redirect: {
      href: "#",
      label: "Read more",
    },
  },
}

export const Colored: Story = {
  args: {
    ...Default.args,
    color: "primary",
  },
}
