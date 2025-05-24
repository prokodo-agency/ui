import { List } from "./List"

import type { ListDefaultItemProps, ListCardItemProps } from "./List.model"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/List",
  component: List,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

const defaultItems: ListDefaultItemProps[] = [
  {
    title: "Icon list element (Redirect)",
    redirect: {
      href: "#",
      target: "_blank",
    },
  },
  {
    title: "Icon list element (Clickable)",
    onClick: () => alert("Clicked"),
  },
  {
    title: "Icon list element",
  },
  {
    title: "Icon list element",
  },
]

const customItems: ListDefaultItemProps[] = [
  {
    title: "Icon list element (Redirect)",
    redirect: {
      href: "#",
      target: "_blank",
    },
  },
  {
    icon: "AbacusIcon",
    title: "Icon list element (Clickable)",
    onClick: () => alert("Clicked"),
  },
  {
    title: "Icon list element",
  },
  {
    title: "Icon list element",
  },
]

const cardItems: ListCardItemProps[] = [
  {
    title: "Card list item (Clickable)",
    onClick: () => console.log("Clicked"),
  },
  {
    icon: "AccelerationIcon",
    title: "Card list item (Icon)",
    desc: "This is a short description",
  },
  {
    icon: "AccidentIcon",
    title: "Card list item",
    desc: "This is a very very very very very very very very very very very long description",
  },
  {
    title: "Card list item",
  },
]

export const Default: Story = {
  args: {
    items: defaultItems,
  },
}

export const Custom: Story = {
  args: {
    items: customItems,
    options: {
      icon: {
        color: "#FFC0CB",
        size: "md",
      },
    },
  },
}

export const Cards: Story = {
  args: {
    type: "card",
    variant: "primary",
    items: cardItems,
  },
}
