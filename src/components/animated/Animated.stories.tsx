import { Animated } from "./Animated"

import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/Animated",
  component: Animated,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    animation: {
      options: [
        "default",
        "bottom-top",
        "top-bottom",
        "left-right",
        "right-left",
      ],
      control: { type: "select" },
      defaultValue: "default",
    },
  },
} satisfies Meta<typeof Animated>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    priority: true,
    children: (
      <div
        style={{
          width: "200px",
          height: "200px",
          background: "dodgerblue",
        }}
      ></div>
    ),
  },
}
