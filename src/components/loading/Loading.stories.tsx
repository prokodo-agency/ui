import { Loading } from "./Loading"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "prokodo/feedback/Loading",
  component: Loading,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ["xs", "sm", "md", "lg", "xl"],
      control: { type: "select" },
    },
    color: {
      options: [
        "inherit",
        "primary",
        "secondary",
        "success",
        "error",
        "info",
        "warning",
        "white",
      ],
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof Loading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: "md",
    color: "inherit",
  },
}

export const Primary: Story = {
  args: {
    size: "md",
    color: "primary",
  },
}

export const Secondary: Story = {
  args: {
    size: "md",
    color: "secondary",
  },
}

export const Success: Story = {
  args: {
    size: "md",
    color: "success",
  },
}

export const Warning: Story = {
  args: {
    size: "md",
    color: "warning",
  },
}

const ALL_COLORS = [
  "inherit",
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "error",
  "white",
] as const

export const AllColors: Story = {
  name: "All Colors",
  args: { size: "md", color: "primary" },
  render: _args => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "2rem",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        background: "var(--pk-color-bg, #1a1a2e)",
        borderRadius: "0.5rem",
      }}
    >
      {ALL_COLORS.map(c => (
        <div
          key={c}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Loading color={c} size="md" />
          <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>{c}</span>
        </div>
      ))}
    </div>
  ),
}
