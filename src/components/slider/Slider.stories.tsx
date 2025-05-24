import { Slider } from "./Slider"

import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/Slider",
  component: Slider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    id: "example1",
    defaultValue: 50,
  },
}

const marks = [
  {
    value: 0,
    label: "0°C",
  },
  {
    value: 20,
    label: "20°C",
  },
  {
    value: 37,
    label: "37°C",
  },
  {
    value: 100,
    label: "100°C",
  },
]

export const WithLabels: Story = {
  args: {
    id: "example2",
    "aria-label": "Temperature",
    defaultValue: 30,
    getAriaValueText: (value: number) => `${value}°C`,
    shiftStep: 30,
    step: 10,
    marks,
    min: 10,
    max: 110,
  },
}
