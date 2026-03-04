// This file has been automatically migrated to valid ESM format by Storybook.
import { fileURLToPath } from "node:url"
import { mergeConfig } from "vite"
import path, { dirname } from "path"
import remarkGfm from "remark-gfm"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(tsx|ts)"],
  staticDirs: ["../assets"],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-themes",
    "@chromatic-com/storybook",
    "@storybook/addon-a11y",
    {
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async config => {
    return mergeConfig(config, {
      base: "/storybook/",
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
