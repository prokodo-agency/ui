import { act, render, screen } from "@/tests"

// ---- Mock the view components ----
jest.mock("./Loading.view", () => ({
  SpinnerView: jest.fn(
    ({ reducedMotion, size }: { reducedMotion?: boolean; size?: string }) => (
      <div
        data-reduced-motion={String(reducedMotion ?? false)}
        data-size={size ?? ""}
        data-testid="spinner-view"
      />
    ),
  ),
  OverlayView: jest.fn(
    ({
      reducedMotion,
      resolvedBackdrop,
    }: {
      reducedMotion?: boolean
      resolvedBackdrop?: string
    }) => (
      <div
        data-backdrop={resolvedBackdrop ?? ""}
        data-reduced-motion={String(reducedMotion ?? false)}
        data-testid="overlay-view"
      />
    ),
  ),
}))

// Helper to create a MQL mock
function makeMatchMedia(matches: boolean) {
  const listeners: Array<(e: { matches: boolean }) => void> = []
  const mql = {
    matches,
    addEventListener: jest.fn(
      (_: string, cb: (e: { matches: boolean }) => void) => {
        listeners.push(cb)
      },
    ),
    removeEventListener: jest.fn(),
    _fire: (newMatches: boolean) => {
      listeners.forEach(cb => cb({ matches: newMatches }))
    },
  }
  return mql
}

describe("Loading.client", () => {
  let originalMatchMedia: typeof window.matchMedia

  beforeEach(() => {
    originalMatchMedia = window.matchMedia
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
    document.documentElement.removeAttribute("data-theme")
  })

  describe("spinner variant (default)", () => {
    it("renders SpinnerView for default variant", () => {
      window.matchMedia = jest.fn().mockReturnValue(makeMatchMedia(false))

      const LoadingClient = require("./Loading.client").default
      render(<LoadingClient />)
      expect(screen.getByTestId("spinner-view")).toBeInTheDocument()
    })

    it("passes reducedMotion=false when no system preference", () => {
      window.matchMedia = jest.fn().mockReturnValue(makeMatchMedia(false))

      const LoadingClient = require("./Loading.client").default
      render(<LoadingClient />)
      expect(screen.getByTestId("spinner-view")).toHaveAttribute(
        "data-reduced-motion",
        "false",
      )
    })

    it("passes reducedMotion=true when explicit reducedMotion=true", () => {
      window.matchMedia = jest.fn().mockReturnValue(makeMatchMedia(false))

      const LoadingClient = require("./Loading.client").default
      render(<LoadingClient reducedMotion={true} />)
      expect(screen.getByTestId("spinner-view")).toHaveAttribute(
        "data-reduced-motion",
        "true",
      )
    })

    it("passes reducedMotion=false when explicit reducedMotion=false", () => {
      window.matchMedia = jest.fn().mockReturnValue(makeMatchMedia(true))

      const LoadingClient = require("./Loading.client").default
      render(<LoadingClient reducedMotion={false} />)
      expect(screen.getByTestId("spinner-view")).toHaveAttribute(
        "data-reduced-motion",
        "false",
      )
    })
  })

  describe("overlay variant", () => {
    it("renders OverlayView for variant=overlay", () => {
      window.matchMedia = jest.fn().mockReturnValue(makeMatchMedia(false))

      const LoadingClient = require("./Loading.client").default
      render(<LoadingClient variant="overlay" />)
      expect(screen.getByTestId("overlay-view")).toBeInTheDocument()
    })

    it("resolves backdrop=dark when backdrop='dark'", () => {
      window.matchMedia = jest.fn().mockReturnValue(makeMatchMedia(false))

      const LoadingClient = require("./Loading.client").default
      render(<LoadingClient backdrop="dark" variant="overlay" />)
      expect(screen.getByTestId("overlay-view")).toHaveAttribute(
        "data-backdrop",
        "dark",
      )
    })

    it("resolves backdrop=light when backdrop='light'", () => {
      window.matchMedia = jest.fn().mockReturnValue(makeMatchMedia(false))

      const LoadingClient = require("./Loading.client").default
      render(<LoadingClient backdrop="light" variant="overlay" />)
      expect(screen.getByTestId("overlay-view")).toHaveAttribute(
        "data-backdrop",
        "light",
      )
    })

    it("resolves backdrop via data-theme attribute when backdrop='auto'", () => {
      document.documentElement.setAttribute("data-theme", "dark")
      window.matchMedia = jest.fn().mockReturnValue(makeMatchMedia(false))

      const LoadingClient = require("./Loading.client").default
      render(<LoadingClient backdrop="auto" variant="overlay" />)
      expect(screen.getByTestId("overlay-view")).toHaveAttribute(
        "data-backdrop",
        "dark",
      )
    })

    it("resolves backdrop via matchMedia when no data-theme (auto)", () => {
      const mql = makeMatchMedia(true) // dark
      window.matchMedia = jest.fn().mockReturnValue(mql)

      const LoadingClient = require("./Loading.client").default
      render(<LoadingClient backdrop="auto" variant="overlay" />)
      // prefers-color-scheme: dark → dark backdrop
      expect(screen.getByTestId("overlay-view")).toHaveAttribute(
        "data-backdrop",
        "dark",
      )
    })

    it("updates backdrop when matchMedia fires change event (auto mode)", async () => {
      const schemeListeners: Array<(e: { matches: boolean }) => void> = []
      const motionListeners: Array<(e: { matches: boolean }) => void> = []

      window.matchMedia = jest.fn((query: string) => {
        const listeners =
          query === "(prefers-color-scheme: dark)"
            ? schemeListeners
            : motionListeners

        return {
          matches: false,
          addEventListener: jest.fn(
            (_: string, cb: (e: { matches: boolean }) => void) => {
              listeners.push(cb)
            },
          ),
          removeEventListener: jest.fn(),
        }
      }) as unknown as typeof window.matchMedia

      const LoadingClient = require("./Loading.client").default
      render(<LoadingClient backdrop="auto" variant="overlay" />)
      expect(screen.getByTestId("overlay-view")).toHaveAttribute(
        "data-backdrop",
        "light",
      )

      // Fire scheme change→dark
      await act(async () => {
        schemeListeners.forEach(cb => cb({ matches: true }))
      })

      expect(screen.getByTestId("overlay-view")).toHaveAttribute(
        "data-backdrop",
        "dark",
      )
    })
  })

  describe("getAutoScheme", () => {
    it("returns 'light' when data-theme='light'", () => {
      document.documentElement.setAttribute("data-theme", "light")
      window.matchMedia = jest.fn().mockReturnValue(makeMatchMedia(false))

      const LoadingClient = require("./Loading.client").default
      render(<LoadingClient backdrop="auto" variant="overlay" />)
      expect(screen.getByTestId("overlay-view")).toHaveAttribute(
        "data-backdrop",
        "light",
      )
    })

    it("returns 'light' when matchMedia matches=false and no data-theme", () => {
      window.matchMedia = jest.fn().mockReturnValue(makeMatchMedia(false))

      const LoadingClient = require("./Loading.client").default
      render(<LoadingClient backdrop="auto" variant="overlay" />)
      expect(screen.getByTestId("overlay-view")).toHaveAttribute(
        "data-backdrop",
        "light",
      )
    })

    it("returns 'dark' when matchMedia fires change to dark, then back to light", async () => {
      // Covers e.matches ? "dark" : "light" — the false (light) branch at line 54
      const schemeListeners: Array<(e: { matches: boolean }) => void> = []
      const motionListeners: Array<(e: { matches: boolean }) => void> = []

      window.matchMedia = jest.fn((query: string) => {
        const listeners =
          query === "(prefers-color-scheme: dark)"
            ? schemeListeners
            : motionListeners
        return {
          matches: false,
          addEventListener: jest.fn(
            (_: string, cb: (e: { matches: boolean }) => void) => {
              listeners.push(cb)
            },
          ),
          removeEventListener: jest.fn(),
        }
      }) as unknown as typeof window.matchMedia

      const LoadingClient = require("./Loading.client").default
      render(<LoadingClient backdrop="auto" variant="overlay" />)
      expect(screen.getByTestId("overlay-view")).toHaveAttribute(
        "data-backdrop",
        "light",
      )

      // fire dark change
      await act(async () => {
        schemeListeners.forEach(cb => cb({ matches: true }))
      })
      expect(screen.getByTestId("overlay-view")).toHaveAttribute(
        "data-backdrop",
        "dark",
      )

      // fire light change (covers the : "light" false branch of the ternary)
      await act(async () => {
        schemeListeners.forEach(cb => cb({ matches: false }))
      })
      expect(screen.getByTestId("overlay-view")).toHaveAttribute(
        "data-backdrop",
        "light",
      )
    })

    it("returns 'dark' when matchMedia matches=true and no data-theme", () => {
      // Covers getAutoScheme returning "dark" via matchMedia when html has no data-theme
      document.documentElement.removeAttribute("data-theme")
      window.matchMedia = jest.fn().mockReturnValue(makeMatchMedia(true))
      const LoadingClient = require("./Loading.client").default
      render(<LoadingClient backdrop="auto" variant="overlay" />)
      expect(screen.getByTestId("overlay-view")).toHaveAttribute(
        "data-backdrop",
        "dark",
      )
    })
  })
})
