import { mergeConfig } from "vite"
import path from "path"

const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(tsx|ts)"],
  staticDirs: ["../assets"],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-themes",
    "@storybook/addon-interactions",
    "@chromatic-com/storybook",
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: "@storybook/builder-vite",
    },
  },
  viteFinal: async config => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "../src"),
        },
      },
    })
  },
  docs: {
    autodocs: true,
  },
  env: { STORYBOOK: "true" },
  typescript: { reactDocgen: "react-docgen-typescript" },
}

export default config
