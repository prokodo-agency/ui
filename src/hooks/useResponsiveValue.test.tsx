import { act, render, renderHook, screen } from "@testing-library/react"
import React from "react"

import { useResponsiveValue, type ContainerRule } from "./useResponsiveValue"

// ---------------------------------------------------------------------------
// matchMedia helpers
// ---------------------------------------------------------------------------

function createMockMatchMedia(initialMatches: Record<string, boolean> = {}): {
  mock: jest.Mock
  fire: (query: string, matches: boolean) => void
} {
  // Each query gets a mutable state object so the captured mql objects
  // reflect updated `matches` values when `compute()` runs.
  const stateMap = new Map<
    string,
    { matches: boolean; listeners: Array<(e: MediaQueryListEvent) => void> }
  >()

  const getState = (query: string) => {
    if (!stateMap.has(query)) {
      stateMap.set(query, {
        matches: initialMatches[query] ?? false,
        listeners: [],
      })
    }
    return stateMap.get(query)!
  }

  const mock = jest.fn((query: string) => {
    const state = getState(query)

    return {
      // getter so compute() always reads the current value
      get matches() {
        return state.matches
      },
      media: query,
      addEventListener: jest.fn(
        (_: string, handler: (e: MediaQueryListEvent) => void) => {
          state.listeners.push(handler)
        },
      ),
      removeEventListener: jest.fn(),
    } as unknown as MediaQueryList
  })

  const fire = (query: string, matches: boolean) => {
    const state = getState(query)
    state.matches = matches
    state.listeners.forEach(fn =>
      fn({ matches, media: query } as MediaQueryListEvent),
    )
  }

  return { mock, fire }
}

// ---------------------------------------------------------------------------
// Component helper for containerRules tests (needs real DOM ref attachment)
// ---------------------------------------------------------------------------

function ContainerTest<T>({
  rules,
  fallback,
  onValue,
}: {
  rules: ContainerRule<T>[]
  fallback: T
  onValue?: (v: T) => void
}): React.JSX.Element {
  const { value, ref } = useResponsiveValue<T>({
    fallback,
    containerRules: rules,
  })
  onValue?.(value)
  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      data-testid="container"
      data-value={String(value)}
    />
  )
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useResponsiveValue", () => {
  let originalMatchMedia: typeof window.matchMedia

  beforeEach(() => {
    originalMatchMedia = window.matchMedia
    // Default: simple no-op matchMedia
    window.matchMedia = jest.fn().mockReturnValue({
      matches: false,
      media: "",
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
    jest.restoreAllMocks()
  })

  // -------------------------------------------------------------------------
  describe("fallback", () => {
    it("returns the fallback value when no rules match", () => {
      const { result } = renderHook(() =>
        useResponsiveValue({ fallback: "default" }),
      )
      expect(result.current.value).toBe("default")
      expect(result.current.ref).toBeDefined()
    })
  })

  // -------------------------------------------------------------------------
  describe("valuesByQueries", () => {
    it("returns value when a media query matches initially", () => {
      const { mock } = createMockMatchMedia({ "(max-width: 600px)": true })
      window.matchMedia = mock

      const { result } = renderHook(() =>
        useResponsiveValue({
          fallback: "big",
          valuesByQueries: [["(max-width: 600px)", "small"]],
        }),
      )
      expect(result.current.value).toBe("small")
    })

    it("returns fallback when query does not match", () => {
      const { mock } = createMockMatchMedia({ "(max-width: 600px)": false })
      window.matchMedia = mock

      const { result } = renderHook(() =>
        useResponsiveValue({
          fallback: "big",
          valuesByQueries: [["(max-width: 600px)", "small"]],
        }),
      )
      expect(result.current.value).toBe("big")
    })

    it("updates value when media query changes", () => {
      const { mock, fire } = createMockMatchMedia({
        "(max-width: 600px)": false,
      })
      window.matchMedia = mock

      const { result } = renderHook(() =>
        useResponsiveValue({
          fallback: "big",
          valuesByQueries: [["(max-width: 600px)", "small"]],
        }),
      )
      expect(result.current.value).toBe("big")

      act(() => fire("(max-width: 600px)", true))
      expect(result.current.value).toBe("small")
    })
  })

  // -------------------------------------------------------------------------
  describe("valuesByBreakpoint", () => {
    const breakpoints = { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 }

    it("returns the matching breakpoint value", () => {
      const { mock } = createMockMatchMedia({ "(min-width:1200px)": true })
      window.matchMedia = mock

      const { result } = renderHook(() =>
        useResponsiveValue({
          fallback: "xs-value",
          breakpoints,
          valuesByBreakpoint: { lg: "lg-value" },
        }),
      )
      expect(result.current.value).toBe("lg-value")
    })

    it("returns fallback when no breakpoint matches", () => {
      const { mock } = createMockMatchMedia({ "(min-width:1200px)": false })
      window.matchMedia = mock

      const { result } = renderHook(() =>
        useResponsiveValue({
          fallback: "xs-value",
          breakpoints,
          valuesByBreakpoint: { lg: "lg-value" },
        }),
      )
      expect(result.current.value).toBe("xs-value")
    })
  })

  // -------------------------------------------------------------------------
  describe("legacy Safari addListener / removeListener", () => {
    it("uses addListener/removeListener when addEventListener is not available", () => {
      const addListenerMock = jest.fn()
      const removeListenerMock = jest.fn()

      window.matchMedia = jest.fn().mockReturnValue({
        matches: false,
        media: "(max-width: 600px)",
        // No addEventListener — simulates old Safari
        addListener: addListenerMock,
        removeListener: removeListenerMock,
      })

      const { unmount } = renderHook(() =>
        useResponsiveValue({
          fallback: "big",
          valuesByQueries: [["(max-width: 600px)", "small"]],
        }),
      )

      expect(addListenerMock).toHaveBeenCalled()
      act(() => void unmount())
      expect(removeListenerMock).toHaveBeenCalled()
    })
  })

  // -------------------------------------------------------------------------
  describe("containerRules", () => {
    it("returns fallback initially when ResizeObserver has not yet fired", () => {
      global.ResizeObserver = jest.fn(() => ({
        observe: jest.fn(),
        disconnect: jest.fn(),
      })) as unknown as typeof ResizeObserver

      render(
        <ContainerTest
          fallback="narrow"
          rules={[{ min: 400, value: "wide" }]}
        />,
      )
      expect(screen.getByTestId("container")).toHaveAttribute(
        "data-value",
        "narrow",
      )
    })

    it("observes the container element via ResizeObserver", () => {
      const observeMock = jest.fn()
      global.ResizeObserver = jest.fn(() => ({
        observe: observeMock,
        disconnect: jest.fn(),
      })) as unknown as typeof ResizeObserver

      render(
        <ContainerTest
          fallback="narrow"
          rules={[{ min: 400, value: "wide" }]}
        />,
      )
      expect(observeMock).toHaveBeenCalledWith(expect.any(HTMLElement))
    })

    it("updates value to matching rule when container is wide enough", async () => {
      let roCallback: ResizeObserverCallback | undefined

      global.ResizeObserver = jest.fn((cb: ResizeObserverCallback) => {
        roCallback = cb
        return { observe: jest.fn(), disconnect: jest.fn() }
      }) as unknown as typeof ResizeObserver

      render(
        <ContainerTest
          fallback="narrow"
          rules={[{ min: 200, value: "wide" }]}
        />,
      )

      await act(async () => {
        roCallback?.(
          [{ contentRect: { width: 500 } } as unknown as ResizeObserverEntry],
          {} as ResizeObserver,
        )
      })

      expect(screen.getByTestId("container")).toHaveAttribute(
        "data-value",
        "wide",
      )
    })

    it("stays on fallback when container width is below the min threshold", async () => {
      let roCallback: ResizeObserverCallback | undefined

      global.ResizeObserver = jest.fn((cb: ResizeObserverCallback) => {
        roCallback = cb
        return { observe: jest.fn(), disconnect: jest.fn() }
      }) as unknown as typeof ResizeObserver

      render(
        <ContainerTest
          fallback="narrow"
          rules={[{ min: 400, value: "wide" }]}
        />,
      )

      await act(async () => {
        roCallback?.(
          [{ contentRect: { width: 200 } } as unknown as ResizeObserverEntry],
          {} as ResizeObserver,
        )
      })

      expect(screen.getByTestId("container")).toHaveAttribute(
        "data-value",
        "narrow",
      )
    })

    it("selects first matching rule when multiple rules exist (min+max range)", async () => {
      let roCallback: ResizeObserverCallback | undefined

      global.ResizeObserver = jest.fn((cb: ResizeObserverCallback) => {
        roCallback = cb
        return { observe: jest.fn(), disconnect: jest.fn() }
      }) as unknown as typeof ResizeObserver

      render(
        <ContainerTest
          fallback="narrow"
          rules={[
            { min: 100, max: 600, value: "medium" },
            { min: 600, value: "wide" },
          ]}
        />,
      )

      await act(async () => {
        roCallback?.(
          [{ contentRect: { width: 300 } } as unknown as ResizeObserverEntry],
          {} as ResizeObserver,
        )
      })

      expect(screen.getByTestId("container")).toHaveAttribute(
        "data-value",
        "medium",
      )
    })

    it("disconnects ResizeObserver on unmount", () => {
      const disconnectMock = jest.fn()

      global.ResizeObserver = jest.fn(() => ({
        observe: jest.fn(),
        disconnect: disconnectMock,
      })) as unknown as typeof ResizeObserver

      const { unmount } = render(
        <ContainerTest
          fallback="narrow"
          rules={[{ min: 400, value: "wide" }]}
        />,
      )
      unmount()
      expect(disconnectMock).toHaveBeenCalled()
    })
  })
})
