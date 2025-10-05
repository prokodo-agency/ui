/* stories/Carousel.stories.tsx
   ─────────────────────────── */

import { Carousel } from "@/components/carousel"

import type { Meta, StoryObj } from "@storybook/react"

/* ---------- Meta ------------------------------------------------- */
const meta = {
  title: "prokodo/common/Carousel",
  component: Carousel,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Responsive, swipe-enabled carousel. All examples use **inline styles** – kein Tailwind, keine externen CSS-Frameworks.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    /* behaviour */
    autoplay: {
      control: { type: "number", min: 1000, step: 500 },
      description: "Auto-slide interval in **ms** (0 = off).",
      table: { type: { summary: "number" } },
    },
    itemsToShow: {
      control: { type: "number", min: 1, step: 1 },
      description: "Number of items visible at once.",
      table: { type: { summary: "number" } },
    },
    enableControl: {
      control: "boolean",
      description: "Show previous / next arrow buttons.",
      table: { type: { summary: "boolean" } },
    },

    /* hide style helper props */
    className: { table: { disable: true } },
    classNameControls: { table: { disable: true } },
    classNameButtons: { table: { disable: true } },
    classNameWrapper: { table: { disable: true } },
    classNameItem: { table: { disable: true } },
    classNameDots: { table: { disable: true } },
    classNameDot: { table: { disable: true } },

    /* handlers hidden */
    onClick: { table: { disable: true } },
    onKeyDown: { table: { disable: true } },
    onMouseEnter: { table: { disable: true } },
    onMouseLeave: { table: { disable: true } },
    onTouchEnd: { table: { disable: true } },
    onTouchMove: { table: { disable: true } },
    onTouchStart: { table: { disable: true } },
    onMouseDown: { table: { disable: true } },
    onMouseUp: { table: { disable: true } },
  },
} satisfies Meta<typeof Carousel>

export default meta

/* ---------- Helpers --------------------------------------------- */
const slideBase = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 192, // 48 rem × 4 px
  fontSize: 24,
  color: "#ffffff",
} as const

/* ---------- Stories --------------------------------------------- */
type Story = StoryObj<typeof meta>

export const Static: Story = {
  args: {
    itemsToShow: 1,
    enableControl: false,
    children: [
      <div key="1" style={{ ...slideBase, backgroundColor: "#1E90FF" }}>
        Slide 1
      </div>,
      <div key="2" style={{ ...slideBase, backgroundColor: "#00E6FF" }}>
        Slide 2
      </div>,
      <div key="3" style={{ ...slideBase, backgroundColor: "#2393a2" }}>
        Slide 3
      </div>,
    ],
  },
}

export const AutoPlay: Story = {
  args: {
    autoplay: 2500,
    itemsToShow: 1,
    enableControl: true,
    children: Array.from({ length: 5 }, (_, i) => (
      <div
        key={`auto-${i}`}
        style={{
          ...slideBase,
          backgroundColor: "#00E6FF",
          color: "#1e484e",
          fontSize: 20,
        }}
      >
        Card {i + 1}
      </div>
    )),
  },
}

export const ThreeAtOnce: Story = {
  args: {
    itemsToShow: 3,
    enableControl: true,
    children: Array.from({ length: 8 }, (_, i) => (
      <div
        key={`multi-${i}`}
        style={{
          ...slideBase,
          height: 160,
          margin: "0 4px",
          backgroundColor: "#1E90FF",
          borderRadius: 8,
        }}
      >
        {i + 1}
      </div>
    )),
  },
}
