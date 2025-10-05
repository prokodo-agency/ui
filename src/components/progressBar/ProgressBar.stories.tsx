import { ProgressBar } from "./ProgressBar"

import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: [
        "inherit",
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "error",
        "white",
      ],
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof ProgressBar>

export default meta

// default story
export const Default: StoryObj<typeof meta> = {
  args: {
    id: "example-progress",
    value: 60,
    label: "Uploading… 60%",
  },
}

// animated updating value story
export const AnimatedProgress: StoryObj<typeof meta> = {
  args: {
    id: "animated-progress",
    value: 10,
    label: "Processing…",
  },
  render: (args, { updateArgs }) => {
    // simulate progress increase every second
    const increment = () => {
      updateArgs(prev => ({ ...prev, value: (prev.value ?? 0) + 10 }))
    }
    setTimeout(increment, 1000)
    return <ProgressBar {...args} />
  },
}
