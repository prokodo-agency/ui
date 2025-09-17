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
    withTime: {
      control: "boolean",
      description: "Enable date + time mode (<input type='datetime-local'>).",
      table: { type: { summary: "boolean" } }
    },
    minuteStep: {
      control: { type: "number", min: 1, step: 1 },
      description: "Minute granularity for time selection (applies when withTime=true).",
      table: { type: { summary: "number" } }
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

/** Date + time, 15-minute steps, with min/max */
export const WithTime: Story = {
  render: args => {
    // Start aligned to minute to avoid odd seconds in the control
    const [value, setValue] = useState<Dayjs | null>(dayjs().second(0).millisecond(0))
    return renderContainer(
      <DatePicker
        {...args}
        value={value}
        onChange={(v) => setValue(v as Dayjs | null)}
      />
    )
  },
  args: {
    name: "meetingAt",
    label: "Meeting at",
    helperText: "Pick date & time (15-minute steps)",
    required: true,
    withTime: true,
    minuteStep: 15,
    // Allow from now minus 1 hour up to two weeks ahead, 18:00 latest
    minDate: dayjs().subtract(1, "hour"),
    maxDate: dayjs().add(14, "day").hour(18).minute(0).second(0).millisecond(0),
    // Important: use datetime format when withTime=true
    format: "YYYY-MM-DDTHH:mm"
  }
}
