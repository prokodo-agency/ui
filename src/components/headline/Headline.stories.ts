import { Headline } from "./Headline"

import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/Headline",
  component: Headline,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      options: ["h1", "h2", "h3", "h4", "h5", "h6"],
      control: { type: "select" },
    },
    highlight: { type: "boolean" },
    size: {
      options: ["xs", "sm", "md", "lg", "xl", "xxl"],
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
      ],
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof Headline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    type: "h1",
    size: "xxl",
    variant: "inherit",
    children: "Lorem ipsum dolar sit amet",
  },
}
