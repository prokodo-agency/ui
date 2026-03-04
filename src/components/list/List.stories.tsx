import { List } from "./List"

import type { ListDefaultItemProps, ListCardItemProps } from "./List.model"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "prokodo/content/List",
  component: List,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "radio",
      options: ["default", "icon", "card"],
      description: "Render type — affects item layout and card styling.",
      table: { defaultValue: { summary: "default" } },
    },
    color: {
      control: "select",
      options: [
        "inherit",
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "error",
      ],
      description: "Visual color applied to list items.",
      table: { defaultValue: { summary: "inherit" } },
    },
    className: {
      control: "text",
      description: "CSS class on the list root `<ul>` element.",
      table: { disable: true },
    },
    classNameDesc: {
      control: "text",
      description: "CSS class applied to description text of each item.",
      table: { disable: true },
    },
    onClick: {
      action: "clicked",
      description: "Optional click handler on the list root.",
    },
    items: {
      description: "Array of item configurations to render.",
      table: {
        type: { summary: "ListDefaultItemProps[] | ListCardItemProps[]" },
      },
    },
    options: {
      description:
        "Shared options for default list items (e.g. shared icon props).",
      table: { type: { summary: "ListDefaultOptions" } },
    },
  },
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const plainItems: ListDefaultItemProps[] = [
  { title: "Getting started with prokodo" },
  { title: "Component architecture overview" },
  { title: "Design tokens and theming" },
  { title: "Accessibility best practices" },
]

const linkItems: ListDefaultItemProps[] = [
  {
    title: "Getting started with prokodo",
    redirect: { href: "#", target: "_blank" },
  },
  {
    title: "Component architecture overview",
    redirect: { href: "#", target: "_blank" },
  },
  {
    title: "Design tokens and theming",
    redirect: { href: "#" },
  },
  {
    title: "Accessibility best practices",
    redirect: { href: "#" },
  },
]

const iconItems: ListDefaultItemProps[] = [
  {
    icon: "CheckmarkCircle01Icon",
    title: "Getting started with prokodo",
    redirect: { href: "#", target: "_blank" },
  },
  {
    icon: "CheckmarkCircle01Icon",
    title: "Component architecture overview",
    redirect: { href: "#", target: "_blank" },
  },
  {
    icon: "CheckmarkCircle01Icon",
    title: "Design tokens and theming",
    redirect: { href: "#" },
  },
  {
    icon: "CheckmarkCircle01Icon",
    title: "Accessibility best practices",
    redirect: { href: "#" },
  },
]

const descriptionItems: ListDefaultItemProps[] = [
  {
    icon: "BookOpen01Icon",
    title: "Getting started",
    desc: "Set up your project and install dependencies in just a few minutes.",
    redirect: { href: "#" },
  },
  {
    icon: "Building03Icon",
    title: "Component architecture",
    desc: "Learn how components are structured and composed with BEM and SCSS modules.",
    redirect: { href: "#" },
  },
  {
    icon: "BrushIcon",
    title: "Design tokens",
    desc: "Use CSS custom properties to build consistent, theme-aware UIs.",
    redirect: { href: "#" },
  },
  {
    icon: "UniversalAccessCircleIcon",
    title: "Accessibility",
    desc: "Follow WCAG guidelines to make your interfaces usable by everyone.",
    redirect: { href: "#" },
  },
]

const cardItems: ListCardItemProps[] = [
  {
    icon: "RocketIcon",
    title: "Performance optimisation",
    desc: "Reduce bundle size and improve Time-to-Interactive with code splitting.",
    onClick: () => console.log("Performance optimisation clicked"),
  },
  {
    icon: "ShieldKeyIcon",
    title: "Security hardening",
    desc: "Implement CSP, CORS headers and secure cookie flags.",
    onClick: () => console.log("Security hardening clicked"),
  },
  {
    icon: "CloudUploadIcon",
    title: "CI / CD deployment",
    desc: "Automate builds, tests and releases with GitHub Actions.",
    onClick: () => console.log("CI/CD clicked"),
  },
  {
    icon: "AnalyticsUpIcon",
    title: "Monitoring & alerting",
    desc: "Track errors and performance metrics with real-time dashboards.",
  },
]

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    items: plainItems,
  },
}

export const WithLinks: Story = {
  args: {
    color: "primary",
    items: linkItems,
  },
}

export const WithIcons: Story = {
  args: {
    color: "primary",
    items: iconItems,
  },
}

export const WithDescriptions: Story = {
  args: {
    color: "primary",
    items: descriptionItems,
  },
}

export const Icons: Story = {
  args: {
    type: "icon",
    color: "primary",
    items: descriptionItems,
  },
}

export const Cards: Story = {
  args: {
    type: "card",
    color: "primary",
    items: cardItems,
  },
}

export const SuccessVariant: Story = {
  args: {
    color: "success",
    items: iconItems,
  },
}

export const ErrorVariant: Story = {
  args: {
    color: "error",
    items: iconItems,
  },
}
