import { Button } from "./Button"

import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
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
    variant: {
      options: ["contained", "outlined", "text"],
      control: { type: "radio" },
    },
    loading: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Button",
    variant: "contained",
    color: "primary",
    iconProps: {
      name: "ArrowRight01Icon",
    },
  },
}

export const WithLink: Story = {
  args: {
    title: "Button",
    variant: "contained",
    color: "primary",
    redirect: {
      href: "#",
      target: "_blank",
    },
    iconProps: {
      name: "ArrowRight01Icon",
    },
  },
}
