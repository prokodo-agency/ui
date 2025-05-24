import { useArgs } from "@storybook/client-api"

import { Accordion } from "./Accordion"

import type { AccordionProps, AccordionItem } from "./Accordion.model"
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
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry&apos;s standard dummy text
        ever since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book.
      </p>
    ),
  },
  {
    title: "Accordion 2",
    renderContent: (
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry&apos;s standard dummy text
        ever since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book.
      </p>
    ),
  },
  {
    title: "Accordion 3",
    renderContent: (
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry&apos;s standard dummy text
        ever since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book.
      </p>
    ),
  },
]

const AccordionWrapper = (args: AccordionProps) => {
  const [{ expanded }, updateArgs] = useArgs()
  const handleChange = (index: number) => updateArgs({ expanded: index })

  return <Accordion {...args} expanded={expanded} onChange={handleChange} />
}

export const Default: Story = {
  args: {
    id: "example",
    expanded: null,
    items,
    onChange: () => console.log("Changed!"),
  },
  parameters: { actions: { argTypesRegex: null } },
  render: args => <AccordionWrapper {...args} />,
}
