import { Icon } from "./Icon"
import { Icons } from "./icon-list"

import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/Icon",
  component: Icon,
  render: args => <Icon {...args} />,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [undefined, ...Icons],
      control: { type: "select" },
    },
    color: {
      defaultValue: "#000000",
      control: { type: "text" },
    },
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: "Home01Icon",
    size: "md",
    color: "#000",
  },
}
