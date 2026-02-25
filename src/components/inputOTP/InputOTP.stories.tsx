import { useState } from "react"

import { InputOTP } from "./InputOTP"

import type { InputOTPProps } from "./InputOTP.model"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/form/InputOTP",
  component: InputOTP,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Accessible one-time password (OTP) / PIN input. Arrow-key navigation, paste support, and keyboard-only digit entry. Calls `onComplete` when all digits are filled.",
      },
    },
  },
  argTypes: {
    length: {
      control: { type: "number", min: 4, max: 8, step: 1 },
    },
    groupLabel: { control: "text" },
    groupInstruction: { control: "text" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    onChange: { action: "changed", table: { disable: true } },
    onComplete: { action: "completed", table: { disable: true } },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof InputOTP>

export default meta
type Story = StoryObj<typeof meta>

function Controlled(args: InputOTPProps) {
  const [value, setValue] = useState("")

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        alignItems: "center",
      }}
    >
      <InputOTP
        {...args}
        onChange={otp => {
          setValue(otp)
          args.onChange?.(otp)
        }}
        onComplete={otp => {
          args.onComplete?.(otp)
        }}
      />
      {value.length > 0 && (
        <p
          style={{
            fontFamily: "var(--font-secondary)",
            fontSize: 13,
            opacity: 0.7,
          }}
        >
          Current value: <strong>{value || "—"}</strong>
        </p>
      )}
    </div>
  )
}

export const Default: Story = {
  args: {
    length: 6,
    groupLabel: "One-time password",
    groupInstruction: "Enter the 6-digit code sent to your device.",
  },
  render: args => <Controlled {...args} />,
}

export const FourDigit: Story = {
  args: {
    length: 4,
    groupLabel: "PIN",
    groupInstruction: "Enter your 4-digit PIN.",
  },
  render: args => <Controlled {...args} />,
}

export const EightDigit: Story = {
  args: {
    length: 8,
    groupLabel: "Security code",
    groupInstruction: "Enter the 8-digit security code.",
  },
  render: args => <Controlled {...args} />,
}

export const Disabled: Story = {
  args: {
    length: 6,
    disabled: true,
    groupLabel: "One-time password",
    groupInstruction: "Input is disabled.",
  },
  render: args => <Controlled {...args} />,
}

export const Required: Story = {
  args: {
    length: 6,
    required: true,
    groupLabel: "Required OTP",
    groupInstruction: "This field is required.",
  },
  render: args => <Controlled {...args} />,
}
