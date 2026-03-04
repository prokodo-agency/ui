import { Calendly } from "@/components/calendly"

import type { Meta, StoryObj } from "@storybook/react-vite"

/* ---------- Story meta ------------------------------------ */
const meta = {
  title: "prokodo/media/Calendly",
  component: Calendly,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    calendlyId: {
      control: "text",
      description: "Your public Calendly slug (`username/event`)",
      table: { type: { summary: "string" } },
    },
    /* ------- animationProps (nested) ---------------------- */
    animationProps: {
      control: "object",
      description: "Props forwarded to `<Animated>` wrapper.",
      table: { type: { summary: "AnimatedProps" } },
    },
    /* ------- colors --------------------------------------- */
    colors: {
      control: "object",
      description:
        "Hex color overrides forwarded to the Calendly widget (text, button, background).",
      table: {
        type: {
          summary: "{ text?: string; button?: string; background?: string }",
        },
      },
    },
    /* ------- data & prefill ------------------------------- */
    data: {
      control: "object",
      description: "Prefill & UTM parameters passed to Calendly.",
      table: { type: { summary: "CalendlyData" } },
    },
    hideLoading: {
      control: "boolean",
      description: "Hide the default spinner placeholder.",
      table: { type: { summary: "boolean" } },
    },
    hideCookieSettings: {
      control: "boolean",
      description: "Suppress Calendly’s GDPR banner.",
      table: { type: { summary: "boolean" } },
    },
    hideEventTypeDetails: {
      control: "boolean",
      description: "Hide the event-type sidebar inside the widget.",
      table: { type: { summary: "boolean" } },
    },
    hideDetails: {
      control: "boolean",
      description: "Hide details on the landing page view.",
      table: { type: { summary: "boolean" } },
    },
    LoadingComponent: {
      control: false,
      description: "Custom React component rendered while the widget loads.",
      table: { type: { summary: "React.ComponentType" } },
    },
    /* Storybook UI clutter off: hide DOM attrs like `className` */
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
} satisfies Meta<typeof Calendly>

export default meta

/* ---------- Default story --------------------------------- */
type Story = StoryObj<typeof meta>

export const InlineDemo: Story = {
  args: {
    calendlyId: "your-team/demo-call",
    colors: { button: "#1E90FF", background: "#FFFFFF" },
    hideCookieSettings: true,
  },
}
