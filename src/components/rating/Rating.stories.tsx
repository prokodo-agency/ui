import { Rating } from "@/components/rating"

import type { Meta, StoryObj } from "@storybook/react"

/* ---------- Meta ------------------------------------------------- */
const meta = {
  title: "prokodo/form/Rating",
  component: Rating,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Star-based rating component with validation and helper text. " +
          "Implemented as a progressively enhanced island component.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    /* --- UX-relevant controls ----------------------------------- */
    label: { control: "text" },
    value: {
      control: { type: "number", min: 0, max: 10, step: 1 },
    },
    min: {
      control: { type: "number", min: 0, max: 10, step: 1 },
    },
    max: {
      control: { type: "number", min: 1, max: 10, step: 1 },
    },
    helperText: { control: "text" },
    errorText: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    fullWidth: { control: "boolean" },
    hideLegend: { control: "boolean" },

    /* --- Disable non-UX / internal props in Storybook ---------- */
    name: { table: { disable: true } },
    className: { table: { disable: true } },
    fieldClassName: { table: { disable: true } },
    groupClassName: { table: { disable: true } },
    iconClassName: { table: { disable: true } },
    inputRef: { table: { disable: true } },

    /* --- Events as actions ------------------------------------- */
    onChange: { action: "changed", table: { disable: true } },
    onValidate: { action: "validated", table: { disable: true } },
    onFocus: { action: "focus", table: { disable: true } },
    onBlur: { action: "blur", table: { disable: true } },
  },
} satisfies Meta<typeof Rating>

export default meta

/* ---------- Story alias ----------------------------------------- */
type Story = StoryObj<typeof meta>

/* ---------- Stories --------------------------------------------- */

export const Default: Story = {
  args: {
    name: "rating-default",
    label: "How satisfied are you?",
    helperText: "1 = not at all, 5 = very satisfied",
  },
}

export const WithInitialValue: Story = {
  args: {
    name: "rating-initial",
    label: "Rating",
    value: 3,
    helperText: "Pre-filled rating (3 out of 5 stars)",
  },
}

export const Disabled: Story = {
  args: {
    name: "rating-disabled",
    label: "Rating (disabled)",
    value: "4",
    disabled: true,
    helperText: "Interaction disabled",
  },
}

export const ReadOnly: Story = {
  args: {
    name: "rating-readonly",
    label: "Rating (read-only)",
    value: 4,
    readOnly: true,
    helperText: "Display only, cannot be changed",
  },
}

export const WithValidation: Story = {
  args: {
    name: "rating-required",
    label: "Please rate",
    required: true,
    min: 1,
    helperText: "Required field, at least 1 star",
    errorTranslations: {
      required: "Please provide a rating.",
      min: "Please give at least one star.",
    },
  },
}

export const CustomBounds: Story = {
  args: {
    name: "rating-ten",
    label: "Rating (1–10)",
    min: 1,
    max: 10,
    helperText: "Scale from 1 to 10 stars",
  },
}
