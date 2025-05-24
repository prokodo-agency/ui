import { type ReactNode, useState } from "react"

import { Icon } from "../icon"

import { Select } from "./Select"

import type { SelectEvent, SelectProps } from "./Select.model"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      options: [
        "inherit",
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "error",
      ],
      control: { type: "select" },
      defaultValue: undefined,
    },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const DefaultItems = [
  { label: "-- Choose --", value: "0" },
  { label: "Option 2", value: "1" },
  { label: "Option 3", value: "2" },
  { label: "Option 4", value: "3" },
]

const DefaultItemsWithIcon = [
  {
    label: "-- Choose --",
    value: "0",
    icon: (): ReactNode => <Icon color="red" name="AbacusIcon" size="sm" />,
  },
  {
    label: "Option 2",
    value: "1",
    icon: (): ReactNode => <Icon color="yellow" name="AbacusIcon" size="sm" />,
  },
  {
    label: "Option 3",
    value: "2",
    icon: (): ReactNode => <Icon color="orange" name="AbacusIcon" size="sm" />,
  },
  {
    label: "Option 4",
    value: "3",
    icon: (): ReactNode => <Icon color="blue" name="AbacusIcon" size="sm" />,
  },
]

const SelectWithState = (args: SelectProps) => {
  const [value, setValue] = useState<string | string[] | null>(null)

  return (
    <Select
      {...args}
      value={value}
      onChange={(_: SelectEvent, value: string | string[] | null) => {
        console.log("Selected value: ", value)
        setValue(value)
      }}
    />
  )
}

export const Default: Story = {
  args: {
    id: "example-select",
    name: "example",
    label: "Example select",
    hideLabel: true,
    items: DefaultItems,
    onChange: e => console.log(e),
  },
  render: args => <SelectWithState {...args} />,
}

export const WithIcon: Story = {
  args: {
    id: "example-select",
    name: "example",
    label: "Example select",
    hideLabel: true,
    items: DefaultItemsWithIcon,
    onChange: e => console.log(e),
  },
  render: args => <SelectWithState {...args} />,
}
