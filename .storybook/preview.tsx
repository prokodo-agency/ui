import React, { useEffect } from "react"
import type { Preview, ReactRenderer } from "@storybook/react"
import { withThemeFromJSXProvider } from "@storybook/addon-themes"
import "../src/styles/theme.scss"

if (typeof window !== 'undefined') {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

const withThemeWrapper = (Story, context) => {
  const theme = context.globals.theme || "light"

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  return <Story />
}

export const decorators = [withThemeWrapper]

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Global theme for components",
    defaultValue: "light",
    toolbar: {
      icon: "circlehollow",
      items: [
        { value: "light", title: "Light" },
        { value: "dark", title: "Dark" },
      ],
    },
  },
}

const preview: Preview = {
  globalTypes,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
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
