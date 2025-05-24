import { Lottie } from "./Lottie"

import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/Lottie",
  component: Lottie,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Lottie>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    animationName: "DataAnalytics",
  },
}
