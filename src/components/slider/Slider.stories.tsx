import { Slider } from "./Slider"

import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/form/Slider",
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
    value: 50,
  },
}

const marks = [
  {
    value: 10,
    label: "10°C",
  },
  {
    value: 20,
    label: "20°C",
  },
  {
    value: 45,
    label: "45°C",
  },
  {
    value: 100,
    label: "100°C",
  },
]

export const WithLabels: Story = {
  args: {
    id: "example2",
    label: "Temperature",
    value: 30,
    step: 5,
    marks,
    min: 10,
    max: 100,
  },
}
