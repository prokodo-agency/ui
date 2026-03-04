// DynamicList.stories.tsx
import { DynamicList } from "@/components/dynamic-list"

import type { Meta, StoryObj } from "@storybook/react-vite"

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
  argTypes: {
    /* --- identity / layout --- */
    id: { table: { disable: true } },
    name: {
      control: "text",
      description: "Prefix used for each input's `name` attribute",
    },
    className: { table: { disable: true } },
    classNameList: { table: { disable: true } },

    /* --- label --- */
    label: { control: "text", description: "Label rendered above the list" },
    labelProps: { table: { disable: true } },

    /* --- state --- */
    disabled: {
      control: "boolean",
      description: "Disable all fields and buttons",
    },
    required: { control: "boolean", description: "Mark list as required" },

    /* --- feedback text --- */
    errorText: {
      control: "text",
      description: "Validation error message shown below the list",
    },
    helperText: {
      control: "text",
      description: "Helper/hint text shown below the list",
    },

    /* --- visual --- */
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
      description: "Color variant applied to child Input/Select fields",
    },

    /* --- complex props (hidden from controls panel) --- */
    fields: { table: { disable: true } },
    value: { table: { disable: true } },
    onChange: { action: "changed", table: { disable: true } },
    buttonAddProps: { table: { disable: true } },
    buttonDeleteProps: { table: { disable: true } },
  },
} satisfies Meta<typeof DynamicList>

export default meta
type Story = StoryObj<typeof meta>

/* ---------- Stories --------------------------------------------- */

/** Single‐field list returns string[] */
export const SingleField: Story = {
  args: {
    name: "values",
    label: "Values",
    color: "primary",
    disabled: false,
    required: false,
    helperText: "",
    errorText: "",
    fields: [{ name: "value", label: "Value" }],
    value: ["First item", "Second item"],
  },
}

/** Multi‐field list returns object[] */
export const MultiField: Story = {
  args: {
    name: "pages",
    fields: [
      {
        fieldType: "select",
        name: "website",
        label: "Page",
        placeholder: "e.g. Startseite",
        items: [
          {
            value: "example-1",
            label: "Example 1",
          },
          {
            value: "example-2",
            label: "Example 2",
          },
          {
            value: "example-3",
            label: "Example 3",
          },
        ],
      },
      { name: "name", label: "Page Name", placeholder: "e.g. Startseite" },
      { name: "url", label: "URL", type: "url", placeholder: "https://..." },
    ],
    value: [
      { name: "Startseite", url: "https://prokodo.de/" },
      { name: "Hausbau", url: "https://prokodo.de/" },
    ],
    onChange: val => console.log(val),
  },
}

/** Custom add/delete button labels */
export const CustomButtons: Story = {
  args: {
    name: "tags",
    fields: [{ name: "value", label: "Tag" }],
    value: ["react", "typescript"],
    buttonDeleteProps: { iconProps: { name: "AccessIcon" }, variant: "text" },
    buttonAddProps: {
      title: "Add new access",
      variant: "text",
      color: "success",
    },
  },
}
