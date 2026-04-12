import { RichText } from "./RichText"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "prokodo/content/RichText",
  component: RichText,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Renders Markdown (or mixed JSX) content. Supports syntax-highlighted code blocks, inline animations, links, and BEM-based color colouring.",
      },
    },
  },
  argTypes: {
    animated: { control: "boolean" },
    color: {
      options: [
        undefined,
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "error",
      ],
      control: { type: "select" },
    },
    linkPolicy: {
      options: ["trusted", "ugc"],
      control: { type: "radio" },
    },
    className: { table: { disable: true } },
    animationProps: { table: { disable: true } },
    linkComponent: { table: { disable: true } },
    overrideParagraph: { table: { disable: true } },
    schema: { table: { disable: true } },
  },
} satisfies Meta<typeof RichText>

export default meta
type Story = StoryObj<typeof meta>

const sampleMarkdown = `
Lorem ipsum **dolor sit amet**, consetetur sadipscing elitr, sed diam nonumy eirmod
tempor invidunt ut labore et dolore magna *aliquyam erat*, sed diam voluptua.

- **Item one**
- _Item two_
- Item three

> Blockquote **example** with some notable text.

\`\`\`ts
const greet = (name: string) => \`Hello, \${name}!\`
console.log(greet("World"))
\`\`\`
`

export const Default: Story = {
  args: {
    children: sampleMarkdown,
  },
}

export const PrimaryVariant: Story = {
  args: {
    color: "primary",
    children: sampleMarkdown,
  },
}

export const SecondaryVariant: Story = {
  args: {
    color: "secondary",
    children: sampleMarkdown,
  },
}

export const WithLink: Story = {
  args: {
    children: `Visit [prokodo.com](https://www.prokodo.com) and [**prokodo.com**](https://www.prokodo.com) for more information.`,
  },
}

export const UGCLinkPolicy: Story = {
  name: "UGC Link Policy",
  args: {
    linkPolicy: "ugc",
    children: `User-generated content with a [link](https://example.com) — gets rel="ugc nofollow".`,
  },
}

export const WithInlineCode: Story = {
  args: {
    children: `Use \`npm install @prokodo/ui\` or \`pnpm add @prokodo/ui\` to install.`,
  },
}
