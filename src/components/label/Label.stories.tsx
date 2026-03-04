import { Fragment, type CSSProperties } from "react"

import { Label } from "./Label"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "prokodo/form/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: { type: "text" },
      defaultValue: "First Name",
    },
    htmlFor: {
      control: { type: "text" },
      description: "ID of the associated form control",
    },
    required: {
      control: { type: "boolean" },
      defaultValue: false,
    },
    error: {
      control: { type: "boolean" },
      defaultValue: false,
      description:
        "When true, applies the `error` modifier to highlight the first word in red",
    },
    className: { control: "text" },
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
      description:
        "Color variant — sets the gradient highlight on the first word",
    },
    contentProps: { table: { disable: true } },
    textProps: { table: { disable: true } },
    children: { table: { disable: true } },
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

// --------------------------------------------------------------------------------
// 1) Default Label: just renders the text
// --------------------------------------------------------------------------------
export const Default: Story = {
  render: args => (
    <Fragment>
      <Label {...args} />
      <br />
    </Fragment>
  ),
  args: {
    label: "First Name",
    htmlFor: "first-name",
    color: "primary",
    required: false,
    error: false,
  },
}

// --------------------------------------------------------------------------------
// 2) Required Label: shows asterisk
// --------------------------------------------------------------------------------
export const Required: Story = {
  render: args => (
    <Fragment>
      <Label {...args} />
    </Fragment>
  ),
  args: {
    label: "Last Name",
    htmlFor: "last-name",
    required: true,
    error: false,
  },
}

// --------------------------------------------------------------------------------
// 3) Error Label: highlights the first word in error style
// --------------------------------------------------------------------------------
export const ErrorState: Story = {
  render: args => (
    <Fragment>
      <Label {...args} />
    </Fragment>
  ),
  args: {
    label: "Email Address",
    htmlFor: "email",
    required: true,
    error: true,
  },
}

// --------------------------------------------------------------------------------
// 4) Variant contexts — Label has no `variant` prop; the highlighted-word colour
//    is inherited via CSS custom properties from parent Input/Select components.
//    This story mimics those overrides directly so you can preview each variant.
// --------------------------------------------------------------------------------
type VariantToken = {
  label: string
  from: string
  to: string
}

const variantTokens: VariantToken[] = [
  {
    label: "primary",
    from: "var(--pk-color-brand)",
    to: "var(--pk-color-accent)",
  },
  {
    label: "secondary",
    from: "var(--pk-color-secondary)",
    to: "var(--pk-color-accent)",
  },
  { label: "success", from: "var(--pk-color-success)", to: "#10CCB8" },
  { label: "warning", from: "var(--pk-color-warning)", to: "#f7cc6a" },
  { label: "error", from: "var(--pk-color-error)", to: "#ff6b6b" },
  { label: "info", from: "var(--pk-color-info)", to: "var(--pk-color-accent)" },
  { label: "white", from: "#ffffff", to: "#ffffffaa" },
  {
    label: "inherit",
    from: "var(--pk-color-muted)",
    to: "var(--pk-color-border)",
  },
]

export const VariantContexts: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        padding: "1rem",
      }}
    >
      {variantTokens.map(({ label, from, to }) => (
        <div
          key={label}
          style={
            {
              "--pk-label-gradient-from": from,
              "--pk-label-gradient-to": to,
            } as CSSProperties
          }
        >
          <Label
            htmlFor={label}
            label={`${label.charAt(0).toUpperCase() + label.slice(1)} variant label`}
          />
        </div>
      ))}
    </div>
  ),
  args: {},
}
