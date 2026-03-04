import { Slider } from "./Slider"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "prokodo/form/Slider",
  component: Slider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    /* --- value & range --- */
    value: {
      control: { type: "number" },
      description: "Current value (controlled)",
    },
    min: {
      control: { type: "number" },
      description: "Minimum value (default: 0)",
    },
    max: {
      control: { type: "number" },
      description: "Maximum value (default: 100)",
    },
    step: {
      control: { type: "number" },
      description: "Step increment (default: 1)",
    },

    /* --- label --- */
    label: { control: "text", description: "Label rendered above the slider" },
    hideLabel: { control: "boolean", description: "Hide the label" },
    required: { control: "boolean", description: "Mark field as required" },

    /* --- feedback --- */
    helperText: {
      control: "text",
      description: "Helper text shown below the slider",
    },
    errorText: { control: "text", description: "Validation error message" },

    /* --- behaviour --- */
    disabled: { control: "boolean", description: "Disable the slider" },
    snap: {
      control: "select",
      options: ["none", "step", "marks"],
      description: "Thumb snapping behaviour",
    },

    /* --- visual --- */
    color: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "success",
        "error",
        "info",
        "warning",
        "white",
        "inherit",
      ],
      description: "Color variant for track and thumb gradient",
    },

    /* --- hidden complex / internal props --- */
    id: { table: { disable: true } },
    name: { table: { disable: true } },
    marks: { table: { disable: true } },
    className: { table: { disable: true } },
    labelProps: { table: { disable: true } },
    valueLabelProps: { table: { disable: true } },

    /* --- events --- */
    onChange: { action: "changed", table: { disable: true } },
    onFocus: { action: "focus", table: { disable: true } },
    onBlur: { action: "blur", table: { disable: true } },
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    id: "example1",
    label: "Volume",
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    color: "primary",
    disabled: false,
    required: false,
    hideLabel: false,
    snap: "none",
    helperText: "",
    errorText: "",
    onChange: () => undefined,
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
    onChange: () => undefined,
  },
}

export const FixedValues: Story = {
  args: {
    id: "example2",
    label: "Temperature",
    value: 30,
    step: 5,
    marks,
    min: 10,
    max: 100,
    snap: "marks",
    onChange: () => undefined,
  },
}
