import { Tooltip } from "@/components/tooltip"

import type { Meta, StoryObj } from "@storybook/react"

/* ---------- Meta ------------------------------------------------- */
const meta = {
  title: "prokodo/feedback/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Accessibility-first Tooltip with progressive enhancement via the Island Pattern. " +
          "By default it is CSS-only (hover + focus) for maximum performance and RSC safety, " +
          "and it hydrates only when needed (e.g. delay / controlled open). " +
          "The trigger is cloned and receives aria-describedby; the tooltip uses role='tooltip'.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    children: <></>,
  },
  argTypes: {
    content: { control: "text" },
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    disabled: { control: "boolean" },

    // Controlled/uncontrolled (interactive path)
    open: { control: "boolean" },
    preventOverflow: { control: "boolean" },
    defaultOpen: { control: "boolean" },
    delay: { control: { type: "number", min: 0, step: 50 } },
    closeDelay: { control: { type: "number", min: 0, step: 50 } },
    openOnHover: { control: "boolean" },
    openOnFocus: { control: "boolean" },

    /* --- Hide non-UX props in Storybook ------------------------- */
    id: { table: { disable: true } },
    className: { table: { disable: true } },
    tooltipClassName: { table: { disable: true } },
    triggerClassName: { table: { disable: true } },
    triggerProps: { table: { disable: true } },
    onOpenChange: { action: "openChanged", table: { disable: true } },
    children: { table: { disable: true } }, // provided via `render`
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

/* ---------- Helpers --------------------------------------------- */
function DemoButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      style={{
        padding: "10px 14px",
        borderRadius: 10,
        border: "1px solid #ddd",
        background: "white",
        cursor: "pointer",
      }}
      {...props}
    />
  )
}

/* ---------- Stories --------------------------------------------- */

/**
 * Default / best practice
 * - Works without JS: shows on hover and keyboard focus.
 * - Trigger gets aria-describedby.
 * - Tooltip uses role="tooltip".
 */
export const Default: Story = {
  args: {
    content: "Helpful hint",
    placement: "top",
  },
  render: args => (
    <Tooltip {...args}>
      <DemoButton>Hover / Focus</DemoButton>
    </Tooltip>
  ),
}

/**
 * Placement matrix
 * - Quick visual verification of spacing and positioning.
 */
export const Placements: Story = {
  args: {
    content: "Tooltip content Tooltip content Tooltip content Tooltip content",
  },
  render: args => (
    <div style={{ display: "grid", gap: 18, gridTemplateColumns: "1fr 1fr" }}>
      <Tooltip {...args} placement="top">
        <DemoButton>Top</DemoButton>
      </Tooltip>
      <Tooltip {...args} placement="bottom">
        <DemoButton>Bottom</DemoButton>
      </Tooltip>
      <Tooltip {...args} placement="left">
        <DemoButton>Left</DemoButton>
      </Tooltip>
      <Tooltip {...args} placement="right">
        <DemoButton>Right</DemoButton>
      </Tooltip>
    </div>
  ),
}

/**
 * Disabled
 * - Tooltip is not rendered.
 * - aria-describedby is not applied.
 */
export const Disabled: Story = {
  args: {
    content: "You should not see this",
    disabled: true,
  },
  render: args => (
    <Tooltip {...args}>
      <DemoButton>Disabled</DemoButton>
    </Tooltip>
  ),
}

/**
 * With delay (interactive path)
 * - Demonstrates progressive enhancement: hydration happens because delay props exist.
 * - Useful for dense UIs where instant hover tooltips feel noisy.
 */
export const WithDelay: Story = {
  args: {
    content: "Opens after 400ms, closes after 200ms",
    delay: 400,
    closeDelay: 200,
    placement: "top",
  },
  render: args => (
    <Tooltip {...args}>
      <DemoButton>Hover slowly</DemoButton>
    </Tooltip>
  ),
}

/**
 * Controlled open state (interactive path)
 * - Use when the tooltip must follow external state (validation, onboarding, etc.).
 * - onOpenChange is wired to Storybook actions.
 */
export const Controlled: Story = {
  args: {
    content: "Controlled tooltip (toggle with the buttons)",
    open: false,
    placement: "bottom",
  },
  render: args => (
    // Storybook Controls can toggle `open` directly.
    // This story focuses on controlled usage patterns.
    <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
      <Tooltip {...args}>
        <DemoButton>Target</DemoButton>
      </Tooltip>
      <small style={{ maxWidth: 420, opacity: 0.8, textAlign: "center" }}>
        Toggle the <code>open</code> control in Storybook to show/hide. Use this
        pattern for onboarding flows or state-driven hints.
      </small>
    </div>
  ),
}

/**
 * Keyboard focus only + Escape (interactive path)
 * - Focus shows the tooltip (Tab onto the trigger).
 * - Escape closes (requires client logic).
 *
 * Note: We force interactivity by setting delay=0.
 */
export const KeyboardAndEscape: Story = {
  args: {
    content: "Tab to focus. Press Escape to close.",
    delay: 0, // forces client path (so Escape handler runs)
    closeDelay: 0,
    openOnFocus: true,
    openOnHover: false,
    placement: "right",
  },
  render: args => (
    <div style={{ display: "grid", gap: 10 }}>
      <Tooltip {...args}>
        <DemoButton>Tab to me</DemoButton>
      </Tooltip>
      <small style={{ maxWidth: 420, opacity: 0.8 }}>
        Use Tab to focus the button, then press Escape to close the tooltip.
      </small>
    </div>
  ),
}

/**
 * Inline text trigger (common real-world usage)
 * - Shows that the trigger can be any single element (not only buttons).
 * - For accessibility, ensure non-interactive triggers are focusable if you
 *   expect keyboard users to discover the tooltip.
 */
export const InlineTextTrigger: Story = {
  args: {
    content: "This tooltip is attached to inline text.",
    placement: "top",
  },
  render: args => (
    <p style={{ maxWidth: 520, lineHeight: 1.6 }}>
      You can attach a tooltip to{" "}
      <Tooltip {...args}>
        <span
          tabIndex={0}
          style={{
            textDecoration: "underline",
            textUnderlineOffset: 3,
            cursor: "help",
          }}
        >
          inline text
        </span>
      </Tooltip>{" "}
      as long as the trigger is a single element. Add <code>tabIndex=0</code> if
      it should be focusable.
    </p>
  ),
}
