import { RichText } from "../rich-text"

import { Accordion } from "./Accordion"

import type { AccordionItem } from "./Accordion.model"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
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
    },
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

const items: AccordionItem[] = [
  {
    title: "Accordion 1",
    renderContent: (
      <RichText>
        1. Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry&apos;s standard dummy text
        ever since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book.
      </RichText>
    ),
  },
  {
    title: "Accordion 2",
    renderContent: (
      <RichText>
        2. Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry&apos;s standard dummy text
        ever since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book.
      </RichText>
    ),
  },
  {
    title: "Accordion 3",
    renderContent: (
      <RichText>
        3. Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry&apos;s standard dummy text
        ever since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book.
      </RichText>
    ),
  },
]

export const Default: Story = {
  args: {
    id: "example",
    expanded: null,
    items,
    onChange: () => console.log("Changed!"),
  },
  render: (args, { updateArgs }) => {
    const handleChange = (index?: number) => updateArgs({ expanded: index })
    return <Accordion {...args} onChange={handleChange} />
  },
}
