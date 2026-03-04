import { useState } from "react"

import { InputOTP } from "./InputOTP"

import type { InputOTPProps } from "./InputOTP.model"
import type { Meta, StoryObj } from "@storybook/react-vite"

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
    color: {
      options: [
        "inherit",
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "error",
        "white",
      ],
      control: { type: "select" },
      description:
        "Color variant — changes the gradient border and focus glow.",
    },
    label: {
      control: "text",
      description:
        "Visible label above the cells. Shows asterisk when `required` is set.",
    },
    helperText: {
      control: "text",
      description: "Helper text shown below the cells.",
    },
    errorText: {
      control: "text",
      description: "Error message shown below the cells in error colour.",
    },
    name: {
      control: "text",
      description: 'Base name/id for the digit inputs. Defaults to "otp".',
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
    label: "One-time password",
    helperText: "Input is disabled.",
  },
  render: args => <Controlled {...args} />,
}

export const Required: Story = {
  args: {
    length: 6,
    required: true,
    label: "Verification code",
    helperText: "Enter the 6-digit code sent to your device.",
  },
  render: args => <Controlled {...args} />,
}

export const WithLabel: Story = {
  args: {
    length: 6,
    label: "One-time password",
    helperText: "Enter the 6-digit code sent to your device.",
  },
  render: args => <Controlled {...args} />,
}

export const WithError: Story = {
  args: {
    length: 6,
    label: "One-time password",
    errorText: "The code you entered is incorrect. Please try again.",
    color: "error",
  },
  render: args => <Controlled {...args} />,
}

export const Variants: Story = {
  args: { length: 6 },
  render: args => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {(
        ["primary", "secondary", "success", "warning", "error", "info"] as const
      ).map(variant => (
        <div
          key={variant}
          style={{ display: "flex", flexDirection: "column", gap: 6 }}
        >
          <span
            style={{
              fontFamily: "var(--font-secondary)",
              fontSize: 12,
              opacity: 0.6,
            }}
          >
            {variant}
          </span>
          <Controlled {...args} color={variant} />
        </div>
      ))}
    </div>
  ),
}
