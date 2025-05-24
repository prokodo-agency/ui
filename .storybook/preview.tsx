import { withThemeFromJSXProvider } from "@storybook/addon-themes"

import type { Preview, ReactRenderer } from "@storybook/react"

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeFromJSXProvider<ReactRenderer>({
      defaultTheme: "light",
      GlobalStyles: undefined,
    }),
  ],
}

export default preview
