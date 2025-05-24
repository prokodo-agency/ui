import { Loading } from "./Loading"

import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/Loading",
  component: Loading,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ["xs", "sm", "md", "lg", "xl"],
    },
  },
} satisfies Meta<typeof Loading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: "md",
  },
}
