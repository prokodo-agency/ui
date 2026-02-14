import { Button } from "../button"
import { Headline } from "../headline"
import { RichText } from "../rich-text"

import { Accordion } from "./Accordion"

import type { AccordionItem } from "./Accordion.model"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/Accordion",
  component: Accordion,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    headerWrapperClassName: { control: "text" },
    headerToggleClassName: { control: "text" },
    type: {
      options: ["card", "panel"],
      control: { type: "select" },
    },
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

/* ---------------------------------------------------------
 * DEFAULT ITEMS
 * --------------------------------------------------------- */

const items: AccordionItem[] = [
  {
    title: "Accordion 1",
    renderContent: (
      <RichText>
        1. Lorem Ipsum is simply dummy text of the printing and typesetting
        industry…
      </RichText>
    ),
  },
  {
    title: "Accordion 2",
    renderContent: (
      <RichText>
        2. Lorem Ipsum is simply dummy text of the printing and typesetting
        industry…
      </RichText>
    ),
  },
  {
    title: "Accordion 3",
    renderContent: (
      <RichText>
        3. Lorem Ipsum is simply dummy text of the printing and typesetting
        industry…
      </RichText>
    ),
  },
]

/* ---------------------------------------------------------
 * DEFAULT STORY
 * --------------------------------------------------------- */

export const Default: Story = {
  args: {
    id: "example",
    type: "card",
    expanded: null,
    items,
  },
  render: (args, { updateArgs }) => (
    <Accordion {...args} onChange={index => updateArgs({ expanded: index })} />
  ),
}

/* ---------------------------------------------------------
 * CUSTOM HEADER (NO ACTIONS)
 * --------------------------------------------------------- */

export const CustomHeader: Story = {
  args: {
    id: "custom-header",
    expanded: null,
    items: [
      {
        title: "Ignored title",
        renderHeader: (
          <Headline size="xs" variant="primary">
            🌟 Custom Header Element (No Actions)
          </Headline>
        ),
        renderContent: (
          <RichText>
            This example shows a fully custom header replacing the default.
          </RichText>
        ),
      },
    ],
  },
  render: (args, { updateArgs }) => (
    <Accordion {...args} onChange={index => updateArgs({ expanded: index })} />
  ),
}

/* ---------------------------------------------------------
 * CUSTOM HEADER **WITH** ACTIONS THAT DO NOT TOGGLE
 * --------------------------------------------------------- */

export const CustomHeaderWithActions: Story = {
  args: {
    id: "custom-header-actions",
    expanded: null,
    items: [
      {
        title: "Ignored title",
        renderHeader: (
          <Headline size="xs" variant="primary">
            ✨ Custom Header + Actions
          </Headline>
        ),

        // 🟢 NEW: header-level actions outside the toggle zone
        renderHeaderActions: (
          <>
            <Button
              aria-label="Edit"
              iconProps={{
                name: "PencilEdit02Icon",
                size: "xs",
              }}
              onClick={() => alert("Edit clicked")}
            />
            <Button
              aria-label="Delete"
              color="error"
              iconProps={{
                name: "Delete02Icon",
                size: "xs",
              }}
              onClick={() => alert("Delete clicked")}
            >
              Delete
            </Button>
          </>
        ),

        renderContent: (
          <RichText>
            The actions above do NOT toggle the accordion because they are
            wrapped in a separate non-click-propagating container.
          </RichText>
        ),
      },
    ],
  },
  render: (args, { updateArgs }) => (
    <Accordion {...args} onChange={index => updateArgs({ expanded: index })} />
  ),
}
