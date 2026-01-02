import { RTE } from "@/components/RTE"

import type { Meta, StoryObj } from "@storybook/react"

/* ---------- Meta ------------------------------------------------- */
const meta = {
  title: "prokodo/form/RTE",
  component: RTE,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Rich Text Editor built on top of the Input component (label, helper, error, counter layout) " +
          "with an integrated toolbar (bold/italic/lists/links/undo/redo). " +
          "Progressive enhancement via the island pattern. " +
          "Security-focused: plain-text paste + HTML allowlist sanitizing.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    /* --- common field props (from Input) ------------------------ */
    label: { control: "text" },
    placeholder: { control: "text" },
    value: { control: "text" },
    helperText: { control: "text" },
    errorText: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    fullWidth: { control: "boolean" },
    maxLength: { control: { type: "number", min: 20, step: 20 } },
    hideCounter: { control: "boolean" },

    /* --- RTE specific ------------------------------------------ */
    rteToolbar: {
      control: "check",
      options: [
        "bold",
        "italic",
        "underline",
        "strike",
        "ul",
        "ol",
        "link",
        "unlink",
        "undo",
        "redo",
      ],
      description:
        "Toolbar features. If not provided, the default feature set is used.",
    },

    /* --- Hide non-UX props in SB -------------------------------- */
    name: { table: { disable: true } },

    className: { table: { disable: true } },
    fieldClassName: { table: { disable: true } },
    inputClassName: { table: { disable: true } },
    inputContainerClassName: { table: { disable: true } },
    onFocus: { action: "focus", table: { disable: true } },
    onBlur: { action: "blur", table: { disable: true } },
    onChange: { action: "changed", table: { disable: true } },
    onValidate: { action: "validated", table: { disable: true } },

    // keep this, but don't add unknown keys like maxLength
    errorTranslations: { table: { disable: true } },
  },
} satisfies Meta<typeof RTE>

export default meta
type Story = StoryObj<typeof meta>

/* ---------- Stories --------------------------------------------- */
export const Default: Story = {
  args: {
    name: "rte-demo",
    label: "Message",
    placeholder: "Write something…",
    helperText: "Use the toolbar for formatting. Paste is plain text.",
  },
}

export const WithInitialContent: Story = {
  args: {
    name: "rte-initial",
    label: "Description",
    value:
      "<p>Hello <strong>world</strong> 👋</p>" +
      "<p>This is <em>rich</em> text.</p>" +
      "<ul><li>Bullet one</li><li>Bullet two</li></ul>",
    helperText: "Select text and apply formatting.",
  },
}

export const Required: Story = {
  args: {
    name: "rte-required",
    label: "Bio",
    required: true,
    helperText: "This field is required.",
    errorTranslations: {
      required: "Please enter text.",
      text: "Invalid text.",
    },
  },
}

export const WithCounter: Story = {
  args: {
    name: "rte-counter",
    label: "Short note",
    maxLength: 140,
    helperText: "Max 140 characters (counter uses the field value).",
  },
}

export const Disabled: Story = {
  args: {
    name: "rte-disabled",
    label: "Notes",
    disabled: true,
    value:
      "<p><strong>Disabled</strong> editor. Toolbar actions are disabled.</p>",
  },
}

export const ReadOnly: Story = {
  args: {
    name: "rte-readonly",
    label: "Preview",
    readOnly: true,
    value: "<p>This content is <strong>read-only</strong>. No editing.</p>",
    helperText: "Use readOnly for previews.",
  },
}

export const MinimalToolbar: Story = {
  args: {
    name: "rte-minimal",
    label: "Comment",
    placeholder: "Only bold, italic and bullets…",
    rteToolbar: ["bold", "italic", "ul"],
    helperText: "Reduced toolbar feature set.",
  },
}

export const LinksOnly: Story = {
  args: {
    name: "rte-links",
    label: "Resources",
    value:
      "<p>Add links via 🔗 (only safe schemes are allowed).</p>" +
      '<p><a href="https://example.com">Example</a></p>',
    rteToolbar: ["link", "unlink"],
    helperText: "Only link + unlink enabled.",
  },
}

export const WithErrorText: Story = {
  args: {
    name: "rte-error",
    label: "Summary",
    value: "<p>Some content</p>",
    errorText: "This is an error message.",
  },
}
