import { Button } from "./Button"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "prokodo/content/Button",
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
  },
}

export const IconOnly: Story = {
  args: {
    "aria-label": "Button",
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

export const WithImage: Story = {
  args: {
    title: "Button with Image",
    variant: "outlined",
    color: "primary",
    image: {
      src: "/assets/images/github_logo.webp",
      alt: "Github icon",
    },
  },
}

export const WithLoading: Story = {
  args: {
    title: "Loading",
    variant: "contained",
    color: "primary",
    loading: true,
  },
}

export const WithLoadingOutlined: Story = {
  args: {
    title: "Loading outlined",
    variant: "outlined",
    color: "primary",
    loading: true,
  },
}

export const WithLoadingText: Story = {
  args: {
    title: "Loading text",
    variant: "text",
    color: "primary",
    loading: true,
  },
}
