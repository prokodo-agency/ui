import { BaseLink } from "./BaseLink"

import type { Meta, StoryObj } from "@storybook/react-vite"

export default {
  title: "prokodo/navigation/BaseLink",
  component: args => <BaseLink {...args}>Link</BaseLink>,
  parameters: {
    layout: "centered",
  },
} as Meta

export const Default: StoryObj = {
  args: {
    href: "https://example.com",
  },
}

export const DisabledLink: StoryObj = {
  args: {
    href: "https://example.com",
    disabled: true,
  },
}

export const ExternalLink: StoryObj = {
  args: {
    href: "https://example.com",
  },
}

export const AppLink: StoryObj = {
  args: {
    href: "mailto:example@example.com",
  },
}

export const LocaleLink: StoryObj = {
  args: {
    href: "/localized-page",
    locale: "en",
  },
}

export const TargetBlankLink: StoryObj = {
  args: {
    href: "https://example.com",
    target: "_blank",
  },
}
