import { Icon } from "./Icon"
import { ICON_NAMES } from "./IconList"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "prokodo/content/Icon",
  component: Icon,
  render: args => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Icon {...args} />
    </div>
  ),
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [undefined, ...ICON_NAMES],
      control: { type: "select" },
    },
    color: {
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
    color: "primary",
  },
}
