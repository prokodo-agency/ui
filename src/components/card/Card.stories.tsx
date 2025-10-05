import { Headline } from "../headline"
import { RichText } from "../rich-text"

import { Card } from "./Card"

import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: [
        "inherit",
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
    variant: "primary",
    highlight: true,
    children,
  },
}

export const CardBackground: Story = {
  args: {
    variant: "primary",
    background: "/images/placeholder_1000x200.webp",
    children,
  },
}

export const CardGradiant: Story = {
  args: {
    variant: "secondary",
    gradiant: true,
    children,
  },
}

export const CardClickHandler: Story = {
  args: {
    variant: "primary",
    background: "/images/placeholder_1000x200.webp",
    onClick: () => console.log("Clicked!"),
    children,
  },
}
