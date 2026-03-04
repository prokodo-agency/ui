import { Lottie } from "./Lottie"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "prokodo/media/Lottie",
  component: Lottie,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    /* ------- source --------------------------------------- */
    animation: {
      control: "text",
      description:
        "URL or asset path to the `.lottie` / `.json` animation file.",
      table: { type: { summary: "string" } },
    },
    /* ------- playback ------------------------------------- */
    loop: {
      control: "boolean",
      description: "Loop the animation indefinitely.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    autoplay: {
      control: "boolean",
      description: "Start playing on mount.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    /* ------- styling -------------------------------------- */
    className: {
      control: "text",
      description: "CSS class applied to the inner Lottie canvas element.",
      table: { type: { summary: "string" } },
    },
    containerClassName: {
      control: "text",
      description: "CSS class applied to the outer container `<div>`.",
      table: { type: { summary: "string" } },
    },
  },
} satisfies Meta<typeof Lottie>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    animation:
      "https://lottie.host/9be763fe-a1be-4789-9e0c-326aa1da26fd/DBJJo3oKXj.lottie",
    loop: true,
    autoplay: true,
  },
}

export const NoLoop: Story = {
  name: "Single Play (no loop)",
  args: {
    animation:
      "https://lottie.host/9be763fe-a1be-4789-9e0c-326aa1da26fd/DBJJo3oKXj.lottie",
    loop: false,
    autoplay: true,
  },
}
