import { Fragment } from "react"

import { Label } from "./Label"

import type { Meta, StoryObj } from "@storybook/react"

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
  render: (args) => (
    <Fragment>
      <Label {...args} />
      <br />
    </Fragment>
  ),
  args: {
    label: "First Name",
    htmlFor: "first-name",
    required: false,
    error: false,
  },
}

// --------------------------------------------------------------------------------
// 2) Required Label: shows asterisk
// --------------------------------------------------------------------------------
export const Required: Story = {
  render: (args) => (
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
  render: (args) => (
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
