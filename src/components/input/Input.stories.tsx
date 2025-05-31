import type { Meta, StoryObj } from "@storybook/react"
import { Input } from "@/components/input"

/* ---------- Meta ------------------------------------------------- */
const meta = {
  title: "prokodo/form/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Native Input-/Textarea-Komponente mit Validierung, Zähler und Helper-Text. \
Progressive Enhancement über das Island-Pattern.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label:        { control: "text" },
    placeholder:  { control: "text" },
    value:        { control: "text" },
    helperText:   { control: "text" },
    errorText:    { control: "text" },
    required:     { control: "boolean" },
    multiline:    { control: "boolean" },
    rows:         { control: { type: "number", min: 2, step: 1 } },
    maxLength:    { control: { type: "number", min: 10, step: 10 } },
    type: {
      control: "select",
      options: ["text", "email", "url", "tel", "number", "password", "color"],
    },

    /* --- Disable UX-non-relevant props in SB -------------------- */
    name:                   { table: { disable: true } },
    className:              { table: { disable: true } },
    fieldClassName:         { table: { disable: true } },
    inputClassName:         { table: { disable: true } },
    inputContainerClassName:{ table: { disable: true } },
    onChange:               { action: "changed",  table: { disable: true } },
    onValidate:             { action: "validated",table: { disable: true } },
  },
} satisfies Meta<typeof Input>

export default meta
/* ---------- Story-Alias ----------------------------------------- */
type Story = StoryObj<typeof meta>

/* ---------- Stories --------------------------------------------- */
export const Default: Story = {
  args: {
    name: "demo",
    label: "Your name",
  },
}

export const WithValidation: Story = {
  args: {
    name: "email",
    type: "email",
    label: "E-Mail",
    placeholder: "me@example.com",
    required: true,
    helperText: "Must be a valid address",
    errorTranslations: { email: "Bitte gültige E-Mail eingeben" },
  },
}

export const Multiline: Story = {
  args: {
    name: "message",
    label: "Your message",
    multiline: true,
    rows: 4,
    maxLength: 160,
    helperText: "Max 160 characters",
  },
}
