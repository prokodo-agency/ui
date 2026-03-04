import { Headline } from "../headline"
import { RichText } from "../rich-text"

import { Card } from "./Card"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "prokodo/layout/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      options: [
        "inherit",
        "panel",
        "white",
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "error",
      ],
      control: { type: "select" },
    },
    loading: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

const children = (
  <>
    <Headline type="h1">Headline</Headline>
    <RichText>
      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
      eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
      voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
      clita kasd gubergren.
    </RichText>
  </>
)

export const Default: Story = {
  args: {
    children,
  },
}

export const CardHighlight: Story = {
  args: {
    color: "primary",
    highlight: true,
    children,
  },
}

export const CardBackground: Story = {
  args: {
    color: "primary",
    background: "/images/placeholder_1000x200.webp",
    children,
  },
}

export const CardGradiant: Story = {
  args: {
    color: "secondary",
    gradiant: true,
    children,
  },
}

export const CardClickHandler: Story = {
  args: {
    color: "primary",
    background: "/images/placeholder_1000x200.webp",
    onClick: () => console.log("Clicked!"),
    children,
  },
}
