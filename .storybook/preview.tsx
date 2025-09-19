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

const footer = (
  <div style={{ font: "13px/1.4 system-ui, sans-serif", padding: "8px 12px", textAlign: "center", opacity: 0.8 }}>
    Next.js CMS: <a href="https://www.prokodo.com/en/solution/next-js-cms?utm_source=storybook&utm_medium=footer" target="_blank" rel="noopener">EN</a>
    &nbsp;•&nbsp;
    <a href="https://www.prokodo.com/de/loesung/next-js-cms?utm_source=storybook&utm_medium=footer" target="_blank" rel="noopener">DE</a>
  </div>
);

const withThemeWrapper = (Story, context) => {
  const theme = context.globals.theme || "light"

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  return (
    <>
      <Story />
      {footer}
    </>
  )
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
