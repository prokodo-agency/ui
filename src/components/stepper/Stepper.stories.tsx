import { useRef } from "react"

import { Stepper } from "./Stepper"

import type { StepperRef, Step, StepperProps } from "./Stepper.model"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "prokodo/layout/Stepper",
  component: Stepper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: { type: "select" },
      options: [
        "primary",
        "secondary",
        "success",
        "warning",
        "error",
        "info",
        "inherit",
      ],
      description:
        "Color variant — controls the gradient theme of step connectors and icon borders.",
    },
  },
} satisfies Meta<typeof Stepper>

export default meta
type Story = StoryObj<typeof meta>

const steps: Step[] = [
  { label: "Flight search" },
  { label: "Booking" },
  { label: "Checkout" },
]

const StepperWithState = (args: StepperProps) => {
  const stepperRef = useRef<StepperRef | null>(null)
  return <Stepper {...args} ref={stepperRef} />
}

export const Default: Story = {
  args: {
    steps,
    initialStep: 1,
    // Add this no-op so the island hydrates:
    onChange: (_, index: number) => console.log("Current Index: ", index),
  },
  render: args => <StepperWithState {...args} />,
}

export const WithIcon: Story = {
  args: {
    steps,
    onChange: (_, index: number) => console.log("Current Index: ", index),
  },
  render: args => <StepperWithState {...args} />,
}

export const Success: Story = {
  args: {
    steps,
    initialStep: 1,
    color: "success",
    onChange: (_, index: number) => console.log("Current Index: ", index),
  },
  render: args => <StepperWithState {...args} />,
}

export const Warning: Story = {
  args: {
    steps,
    initialStep: 1,
    color: "warning",
    onChange: (_, index: number) => console.log("Current Index: ", index),
  },
  render: args => <StepperWithState {...args} />,
}

export const Error: Story = {
  args: {
    steps,
    initialStep: 1,
    color: "error",
    onChange: (_, index: number) => console.log("Current Index: ", index),
  },
  render: args => <StepperWithState {...args} />,
}
