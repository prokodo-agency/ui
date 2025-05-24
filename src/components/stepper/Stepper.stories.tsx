import { useRef } from "react"

import { Stepper } from "./Stepper"

import type { StepperRef, Step, StepperProps } from "./Stepper.model"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/Stepper",
  component: Stepper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Stepper>

export default meta
type Story = StoryObj<typeof meta>

const steps: Step[] = [
  {
    label: "Step 1",
  },
  {
    label: "Step 2",
  },
  {
    label: "Step 3",
  },
]

const StepperWithState = (args: StepperProps) => {
  const stepperRef = useRef<StepperRef | null>(null)
  return <Stepper {...args} ref={stepperRef} />
}

export const Default: Story = {
  args: {
    steps,
  },
  render: args => <StepperWithState {...args} />,
}

export const WithIcon: Story = {
  args: {
    steps,
  },
  render: args => <StepperWithState {...args} />,
}
