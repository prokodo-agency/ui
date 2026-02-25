;(globalThis as any).__PACKAGE_VERSION__ = "0.0.17"
// Import necessary utilities
import { TextDecoder, TextEncoder } from "util"

// Import jest-dom for better assertions on the DOM
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/jest-globals"
// Mock canvas for testing components using canvas
import "jest-canvas-mock"
// Register jest-axe matchers for WCAG 2.2 accessibility assertions
import { toHaveNoViolations } from "jest-axe"

expect.extend(toHaveNoViolations)

// Assign global variables for TextEncoder/Decoder
Object.assign(global, { TextDecoder, TextEncoder })

// jsdom does not implement window.scrollTo; silence "Not implemented" errors.
Object.defineProperty(window, "scrollTo", {
  value: jest.fn(),
  writable: true,
})

// Mock createIsland to render its Server component synchronously in tests.
// Island components use React.lazy internally, which causes Suspense-based
// AggregateErrors in subsequent tests within the same file. By returning the
// Server component directly we eliminate the React.lazy Suspense cycle while
// keeping rendering output identical (the Server fallback renders children).
jest.mock("@/helpers/createIsland", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react")
  return {
    createIsland: ({
      name,
      Server,
    }: {
      name: string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Server: React.ComponentType<any>
      loadLazy: unknown
      isInteractive?: unknown
    }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Island = ({ priority: _p, ...props }: any) =>
        // Pass `data-island` just as the real island does via withIslandAttr,
        // so tests that assert on `data-island` still work.
        React.createElement(Server, {
          ...props,
          "data-island": name.toLowerCase(),
        })
      Island.displayName = `${name}Island`
      return Island
    },
  }
})
