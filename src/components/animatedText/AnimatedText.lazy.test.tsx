import { expect } from "@jest/globals"

import AnimatedTextLazy from "./AnimatedText.lazy"

interface MockLazyConfig {
  [key: string]: unknown
}

// Mock createLazyWrapper
jest.mock("@/helpers/createLazyWrapper", () => ({
  createLazyWrapper: jest.fn((config: MockLazyConfig) => config),
}))

// Mock client and server components
jest.mock("./AnimatedText.client", () => ({
  __esModule: true,
  default: () => null,
}))

jest.mock("./AnimatedText.server", () => ({
  __esModule: true,
  default: () => null,
}))

describe("AnimatedText.lazy", () => {
  it("should create lazy wrapper with correct config", () => {
    expect(AnimatedTextLazy).toHaveProperty("name", "AnimatedText")
    expect(AnimatedTextLazy).toHaveProperty("hydrateOnVisible", true)
  })

  it("should mark as non-interactive when disabled", () => {
    const { isInteractive } = AnimatedTextLazy as unknown as {
      isInteractive: (props: { disabled?: boolean }) => boolean
    }

    expect(isInteractive({ disabled: true })).toBe(false)
    expect(isInteractive({ disabled: false })).toBe(true)
    expect(isInteractive({})).toBe(true)
  })
})
