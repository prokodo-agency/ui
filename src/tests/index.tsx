import "@testing-library/jest-dom"
import { render as rtlRender, type RenderOptions } from "@testing-library/react"

import type { ReactElement } from "react"

// Create a custom render function that wraps around the original render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "queries">,
): ReturnType<typeof rtlRender> => rtlRender(ui, options)

// Re-export everything from @testing-library/react except the render function
// Avoid the conflicting `render` export by not using `export * from ...`
export {
  // Re-export other functions manually to avoid duplication issues
  fireEvent,
  screen,
  waitFor,
  act,
  cleanup,
} from "@testing-library/react"

// Export the custom render function as `render`
export { customRender as render }
