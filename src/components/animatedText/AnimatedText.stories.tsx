import { AnimatedText } from "./AnimatedText"

import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/AnimatedText",
  component: AnimatedText,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    delay: {
      control: { type: "number", min: 0, step: 50 },
      description: "Delay **in ms** before typing starts once visible.",
      table: { type: { summary: "number" } },
    },
    speed: {
      control: { type: "number", min: 10, step: 10 },
      description: "Interval **in ms** between each character.",
      table: { type: { summary: "number" } },
    },
    disabled: {
      control: "boolean",
      description: "Render static text (no animation).",
      table: { type: { summary: "boolean" } },
    },
  }
} satisfies Meta<typeof AnimatedText>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    style: {
      fontFamily: "Orbitron",
      fontSize: 24,
    },
    children: "Do you want to write some text?",
  },
}
