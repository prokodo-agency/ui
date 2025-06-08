/* eslint-disable */
import dayjs, { type Dayjs } from "dayjs"
import { useState } from "react"

import { DatePicker } from "./DatePicker"

import type { Meta, StoryObj } from "@storybook/react"


const meta = {
  title: "prokodo/form/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A native `<input type='date'>` wrapped with Dayjs parsing, validation and floating label."
      }
    }
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "Unique form field name/id",
      table: { type: { summary: "string" } }
    },
    label: {
      control: "text",
      description: "Floating label text",
      table: { type: { summary: "string" } }
    },
    required: {
      control: "boolean",
      description: "Mark field as required",
      table: { type: { summary: "boolean" } }
    },
    helperText: {
      control: "text",
      description: "Helper or hint text",
      table: { type: { summary: "string" } }
    },
    errorText: {
      control: "text",
      description: "Error text to display",
      table: { type: { summary: "string" } }
    },
    format: {
      control: "text",
      description: "Dayjs parsing format (defaults to YYYY-MM-DD)",
      table: { type: { summary: "string" } }
    },
    minDate: {
      table: { disable: true }
    },
    maxDate: {
      table: { disable: true }
    },
    onChange: { action: "changed", table: { disable: true } },
    onValidate: { action: "validated", table: { disable: true } }
  }
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

const renderContainer = (children) => (
    <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)"
    }}>{children}</div>
)

/** Controlled example: user can pick any date */
export const Default: Story = {
  render: args => {
    const [value, setValue] = useState<Dayjs | null>(dayjs())
    return renderContainer(
        <DatePicker
            {...args}
            value={value}
            onChange={(value) => setValue(dayjs(value))}
        />
    )
  },
  args: {
    name: "birthday",
    label: "Birthday",
    helperText: "Select your birth date",
    required: false,
    format: "YYYY-MM-DD"
  }
}

/** With min/max range and required */
export const WithRange: Story = {
  render: args => {
    const [value, setValue] = useState<Dayjs | null>(null)
    return renderContainer(
      <DatePicker
        {...args}
        value={value}
        onChange={(value) => setValue(dayjs(value))}
      />
    )
  },
  args: {
    name: "appointment",
    label: "Appointment Date",
    helperText: "Between today and 30 days from now",
    required: true,
    minDate: dayjs(),
    maxDate: dayjs().add(30, "day"),
    format: "YYYY-MM-DD"
  }
}
