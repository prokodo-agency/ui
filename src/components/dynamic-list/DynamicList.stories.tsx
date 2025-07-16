// DynamicList.stories.tsx
import { DynamicList } from "@/components/dynamic-list"

import type { Meta, StoryObj } from "@storybook/react"

/* ---------- Meta ------------------------------------------------- */
const meta = {
  title: "prokodo/form/DynamicList",
  component: DynamicList,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A repeatable list field for forms. Supports one or multiple inputs per row, add/remove buttons, and full control via props.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    name:         { control: "text", description: "Prefix for each field name" },
    fields:             { table: { disable: true } },
    value:              { table: { disable: true } },
    onChange:           { action: "changed", table: { disable: true } },
    buttonAddProps:     { table: { disable: true } },
    buttonDeleteProps:  { table: { disable: true } },
    className:          { table: { disable: true } },
    classNameList:      { table: { disable: true } },
  },
} satisfies Meta<typeof DynamicList>

export default meta
type Story = StoryObj<typeof meta>

/* ---------- Stories --------------------------------------------- */

/** Single‐field list returns string[] */
export const SingleField: Story = {
  args: {
    name: "values",
    fields: [
      { name: "value", label: "Value" },
    ],
    value: ["First item", "Second item"],
  },
}

/** Multi‐field list returns object[] */
export const MultiField: Story = {
  args: {
    name: "pages",
    fields: [
      { name: "name", label: "Page Name", placeholder: "e.g. Startseite" },
      { name: "url",  label: "URL",  type: "url", placeholder: "https://..." },
    ],
    value: [
      { name: "Startseite", url: "https://prokodo.de/" },
      { name: "Hausbau",    url: "https://prokodo.de/" },
    ],
  },
}

/** Custom add/delete button labels */
export const CustomButtons: Story = {
  args: {
    name: "tags",
    fields: [{ name: "value", label: "Tag" }],
    value: ["react", "typescript"],
    buttonDeleteProps: { iconProps: { name: "AccessIcon" }, variant: "text" },
    buttonAddProps: { title: "Add new access", variant: "text", color: "success" }
  },
}
