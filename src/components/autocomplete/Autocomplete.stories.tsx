import { useMemo, useState } from "react"

import { Autocomplete } from "./Autocomplete"

import type { AutocompleteItem, AutocompleteProps } from "./Autocomplete.model"
import type { Meta, StoryObj } from "@storybook/react"

const demoItems: AutocompleteItem[] = [
  {
    value: "https://www.npmjs.com/package/@prokodo/ui",
    label: "@prokodo/ui",
    description: "0.1.12 · Prokodo UI component library",
  },
  {
    value: "https://www.npmjs.com/package/@prokodo/cli",
    label: "@prokodo/cli",
    description: "0.5.3 · CLI for scaffolding and automation",
  },
  {
    value: "https://www.npmjs.com/package/n8n-nodes-prokodo",
    label: "n8n-nodes-prokodo",
    description: "1.0.4 · Community n8n nodes",
  },
  {
    value: "https://www.npmjs.com/package/@types/node",
    label: "@types/node",
    description: "24.0.0 · TypeScript definitions for Node.js",
  },
  {
    value: "https://www.npmjs.com/package/next",
    label: "next",
    description: "16.1.0 · The React framework",
  },
]

const meta = {
  title: "prokodo/form/Autocomplete",
  component: Autocomplete,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Accessible, keyboard-navigable autocomplete with listbox panel. Best used as controlled input with async result fetching and canonical value selection.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    loading: { control: "boolean" },
    loadingText: { control: "text" },
    emptyText: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    minQueryLength: { control: { type: "number", min: 1, step: 1 } },

    value: { table: { disable: true } },
    items: { table: { disable: true } },
    className: { table: { disable: true } },
    inputClassName: { table: { disable: true } },
    listClassName: { table: { disable: true } },
    itemClassName: { table: { disable: true } },
    onChange: { action: "changed", table: { disable: true } },
    onSelect: { action: "selected", table: { disable: true } },
  },
} satisfies Meta<typeof Autocomplete>

export default meta
type Story = StoryObj<typeof meta>

function Playground(args: AutocompleteProps) {
  const [query, setQuery] = useState("")

  const filteredItems = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (needle.length === 0) return demoItems

    return demoItems.filter(item => {
      const inLabel = item.label.toLowerCase().includes(needle)
      const inDescription = item.description?.toLowerCase().includes(needle)
      return inLabel || Boolean(inDescription)
    })
  }, [query])

  return (
    <div style={{ width: 480, maxWidth: "90vw" }}>
      <Autocomplete
        {...args}
        items={filteredItems}
        value={query}
        onChange={event => setQuery(event.query)}
        onSelect={item => setQuery(item.label)}
      />
    </div>
  )
}

/* eslint react-hooks/rules-of-hooks: 0 */
export const Default: Story = {
  args: {
    name: "package",
    label: "Public npm package",
    placeholder: "Search package name (e.g. @scope/name)",
    minQueryLength: 2,
    emptyText: "No matching package found.",
    loadingText: "Searching npm packages…",
  },
  render: args => <Playground {...args} />,
}

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
  render: args => <Playground {...args} />,
}

export const EmptyState: Story = {
  args: {
    ...Default.args,
    emptyText: "No packages found for this query.",
  },
  render: args => {
    const [query, setQuery] = useState("this-does-not-exist")

    return (
      <div style={{ width: 480, maxWidth: "90vw" }}>
        <Autocomplete
          {...args}
          items={[]}
          value={query}
          onChange={event => setQuery(event.query)}
          onSelect={() => {}}
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
  render: args => <Playground {...args} />,
}

export const MinQueryLengthOne: Story = {
  args: {
    ...Default.args,
    minQueryLength: 1,
  },
  render: args => <Playground {...args} />,
}
