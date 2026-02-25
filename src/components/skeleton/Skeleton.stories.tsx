import { Skeleton } from "./Skeleton"

import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Animated loading placeholder used while content is being fetched. Supports three shape variants (text, rectangular, circular) and three animation modes (wave, pulse, none).",
      },
    },
  },
  argTypes: {
    variant: {
      options: ["text", "rectangular", "circular"],
      control: { type: "radio" },
    },
    animation: {
      options: ["wave", "pulse", "none"],
      control: { type: "radio" },
    },
    width: { control: "text" },
    height: { control: "text" },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: "rectangular",
    animation: "wave",
    width: "100%",
    height: "160px",
  },
}

export const TextRow: Story = {
  args: {
    variant: "text",
    animation: "wave",
    width: "80%",
    height: "1.25rem",
  },
}

export const TextParagraph: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Skeleton animation="wave" height="1.25rem" variant="text" width="100%" />
      <Skeleton animation="wave" height="1.25rem" variant="text" width="90%" />
      <Skeleton animation="wave" height="1.25rem" variant="text" width="75%" />
    </div>
  ),
}

export const CircularAvatar: Story = {
  args: {
    variant: "circular",
    animation: "wave",
    width: "48px",
    height: "48px",
  },
}

export const CardSkeleton: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Skeleton
        animation="wave"
        height="48px"
        variant="circular"
        width="48px"
      />
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}
      >
        <Skeleton animation="wave" height="1rem" variant="text" width="60%" />
        <Skeleton
          animation="wave"
          height="0.875rem"
          variant="text"
          width="40%"
        />
      </div>
    </div>
  ),
}

export const PulseAnimation: Story = {
  args: {
    variant: "rectangular",
    animation: "pulse",
    width: "100%",
    height: "120px",
  },
}

export const NoAnimation: Story = {
  args: {
    variant: "rectangular",
    animation: "none",
    width: "100%",
    height: "120px",
  },
}
