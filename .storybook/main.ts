import type { StorybookConfig } from "@storybook/react"

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(tsx|ts)"],
  staticDirs: ["../src/assets"],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-themes",
    "@storybook/addon-interactions",
    "@chromatic-com/storybook"
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: "@storybook/builder-vite"
    },
  },

  docs: {},
  env: { STORYBOOK: "true" },
  typescript: { reactDocgen: "react-docgen-typescript" },
}

export default config
