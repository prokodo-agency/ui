import { Image } from "./Image"

import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/Image",
  component: Image,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Smart image component that falls back to a native `<img>` tag on the server and uses Next.js `<Image>` on the client for optimised delivery. Always supply meaningful `alt` text; pass `alt=""` for purely decorative images.',
      },
    },
  },
  argTypes: {
    src: { control: "text" },
    alt: { control: "text" },
    width: { control: { type: "number" } },
    height: { control: { type: "number" } },
    caption: { control: "text" },
    className: { table: { disable: true } },
    containerClassName: { table: { disable: true } },
    captionClassName: { table: { disable: true } },
  },
} satisfies Meta<typeof Image>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    src: "/images/placeholder_1000x200.webp",
    alt: "Placeholder image",
    width: 600,
    height: 120,
  },
}

export const WithCaption: Story = {
  args: {
    src: "/images/placeholder_1000x200.webp",
    alt: "Banner with caption",
    width: 600,
    height: 120,
    caption: "Photo courtesy of prokodo.com",
  },
}

export const Square: Story = {
  args: {
    src: "/images/placeholder_1000x200.webp",
    alt: "Square crop preview",
    width: 300,
    height: 300,
    style: { objectFit: "cover" },
  },
}

export const Decorative: Story = {
  name: "Decorative (alt empty)",
  args: {
    src: "/images/placeholder_1000x200.webp",
    alt: "",
    width: 600,
    height: 120,
  },
}

export const Priority: Story = {
  args: {
    src: "/images/placeholder_1000x200.webp",
    alt: "Above-the-fold hero image loaded with priority",
    width: 600,
    height: 120,
    priority: true,
  },
}
