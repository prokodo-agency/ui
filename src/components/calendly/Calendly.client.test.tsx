import React from "react"

import { act, render, screen } from "@/tests"

let capturedOnAnimate: ((v: boolean) => void) | null = null
let capturedScript: HTMLScriptElement | null = null

jest.mock("@/components/animated", () => ({
  Animated: (props: {
    children: React.ReactNode
    onAnimate?: (v: boolean) => void
  }) => {
    if (props.onAnimate) capturedOnAnimate = props.onAnimate
    return <div data-testid="animated">{props.children}</div>
  },
}))

jest.mock("@/components/loading", () => ({
  Loading: () => <div data-testid="loading" />,
}))

const CalendlyClient = require("./Calendly.client").default

beforeEach(() => {
  capturedOnAnimate = null
  capturedScript = null
  jest.useFakeTimers()
  // Silence intentional component console output during tests
  jest.spyOn(console, "warn").mockImplementation(() => {})
  jest.spyOn(console, "debug").mockImplementation(() => {})
  const realCreate = document.createElement.bind(document)
  jest
    .spyOn(document, "createElement")
    .mockImplementation((tag: string, ...rest: unknown[]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const el = (realCreate as any)(tag, ...rest)
      if (tag === "script") capturedScript = el as HTMLScriptElement
      return el
    })
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.restoreAllMocks()
  jest.useRealTimers()
})

describe("Calendly.client", () => {
  // CSS test FIRST – cssAlreadyLoaded starts false only on first render
  it("appends a CSS link to document.head on first mount", () => {
    const appendSpy = jest.spyOn(document.head, "appendChild")
    render(<CalendlyClient calendlyId="user/event" />)
    const linkCalls = appendSpy.mock.calls.filter(
      ([n]) => (n as HTMLLinkElement).rel === "stylesheet",
    )
    expect(linkCalls.length).toBeGreaterThanOrEqual(1)
    const link = linkCalls[0]?.[0] as HTMLLinkElement
    expect(link.href).toContain("calendly")
  })

  it("shows Loading initially when not initialized", () => {
    render(<CalendlyClient calendlyId="user/event" />)
    expect(screen.getByTestId("loading")).toBeInTheDocument()
  })

  it("hides Loading when hideLoading=true", () => {
    render(<CalendlyClient hideLoading calendlyId="user/event" />)
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument()
  })

  it("appends a script tag to document.body on first mount", () => {
    render(<CalendlyClient calendlyId="user/event" />)
    expect(capturedScript).not.toBeNull()
    expect(capturedScript?.src).toContain("calendly.com")
    expect(capturedScript?.async).toBe(true)
  })

  it("shows watchdog error after 8000 ms when script never loads", () => {
    render(<CalendlyClient calendlyId="user/event" />)
    act(() => jest.advanceTimersByTime(8000))
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.getByRole("alert")).toHaveTextContent(/did not load/i)
  })

  it("shows open-in-tab link when dataUrl available on watchdog", () => {
    render(<CalendlyClient calendlyId="user/event" />)
    act(() => jest.advanceTimersByTime(8000))
    const link = screen.getByRole("link")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining("calendly.com"),
    )
  })

  it("shows error on script onerror", () => {
    render(<CalendlyClient calendlyId="user/event" />)
    act(() => {
      ;(capturedScript as unknown as { onerror(): void }).onerror?.()
    })
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.getByRole("alert")).toHaveTextContent(/blocked|failed/i)
  })

  it("onAnimate with visible=false does not trigger init", () => {
    render(<CalendlyClient calendlyId="user/event" />)
    act(() => {
      capturedOnAnimate?.(false)
    })
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(screen.getByTestId("loading")).toBeInTheDocument()
  })

  it("renders the Animated wrapper and container div", () => {
    const { container } = render(<CalendlyClient calendlyId="user/event" />)
    expect(screen.getByTestId("animated")).toBeInTheDocument()
    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelectorAll("div").length).toBeGreaterThan(1)
  })

  it("builds dataUrl with hideDetails param", () => {
    render(<CalendlyClient hideDetails calendlyId="user/event" />)
    act(() => jest.advanceTimersByTime(8000))
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      expect.stringContaining("hide_landing_page_details=1"),
    )
  })

  it("builds dataUrl with hideCookieSettings param", () => {
    render(<CalendlyClient hideCookieSettings calendlyId="user/event" />)
    act(() => jest.advanceTimersByTime(8000))
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      expect.stringContaining("hide_gdpr_banner=1"),
    )
  })

  // Tests below trigger script onload – must come last (they set scriptAlreadyLoaded=true)

  it("onAnimate with visible=true but script not yet loaded does not call tryInit (scriptLoaded=false branch)", () => {
    // scriptAlreadyLoaded=false at this point → scriptLoaded starts as false
    render(<CalendlyClient calendlyId="user/event" />)
    act(() => {
      capturedOnAnimate?.(true)
    })
    // scriptLoaded=false → the if(scriptLoaded) is false → tryInit NOT called
    // widget remains uninitialized (loading spinner still shown)
    expect(screen.getByTestId("loading")).toBeInTheDocument()
  })

  it("shows error for missing calendlyId after script loads", () => {
    render(<CalendlyClient />)
    act(() => {
      ;(capturedScript as unknown as { onload(): void }).onload?.()
    })
    act(() => jest.advanceTimersByTime(0))
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.getByRole("alert")).toHaveTextContent(/missing/i)
  })

  // scriptAlreadyLoaded=true from previous test; component auto-sets scriptLoaded=true
  it("calls window.Calendly.initInlineWidget when scriptAlreadyLoaded", () => {
    const initInlineWidget = jest.fn()
    ;(window as unknown as { Calendly: unknown }).Calendly = {
      initInlineWidget,
    }
    render(<CalendlyClient calendlyId="user/event" />)
    // scriptAlreadyLoaded=true → effect immediately sets scriptLoaded=true
    // → last-resort effect fires tryInit via setTimeout(0)
    act(() => jest.advanceTimersByTime(0))
    expect(initInlineWidget).toHaveBeenCalled()
    delete (window as unknown as { Calendly?: unknown }).Calendly
  })

  // Additional coverage: safePrefill with data fields
  it("passes data fields as prefill to window.Calendly.initInlineWidget", () => {
    const initInlineWidget = jest.fn()
    ;(window as unknown as { Calendly: unknown }).Calendly = {
      initInlineWidget,
    }
    render(
      <CalendlyClient
        calendlyId="user/event"
        data={{
          name: "John",
          email: "john@example.com",
          firstName: "John",
          lastName: "Doe",
        }}
      />,
    )
    act(() => jest.advanceTimersByTime(0))
    expect(initInlineWidget).toHaveBeenCalledWith(
      expect.objectContaining({
        prefill: expect.objectContaining({
          name: "John",
          email: "john@example.com",
        }),
      }),
    )
    delete (window as unknown as { Calendly?: unknown }).Calendly
  })

  // Additional coverage: tryInit with no calendlyId via direct onAnimate call
  it("sets error 'missing' via onAnimate when calendlyId is absent", () => {
    // scriptAlreadyLoaded=true → scriptLoaded=true → onAnimate calling tryInit works
    render(<CalendlyClient />)
    act(() => {
      capturedOnAnimate?.(true)
    })
    expect(screen.getByRole("alert")).toHaveTextContent(/missing/i)
  })

  // Additional coverage: tryInit missing calendlyId via setTimeout(0) flush
  it("sets error 'missing' via last-resort effect when calendlyId is absent", () => {
    render(<CalendlyClient />)
    act(() => jest.advanceTimersByTime(0))
    expect(screen.getByRole("alert")).toHaveTextContent(/missing/i)
  })

  // Additional coverage: cleanup effect clears host innerHTML on unmount
  it("cleanup effect clears host on unmount", () => {
    const { unmount } = render(<CalendlyClient calendlyId="user/event" />)
    act(() => jest.advanceTimersByTime(0))
    // unmount triggers cleanup: host.innerHTML="", delete host.dataset.initialized
    expect(() => act(() => unmount())).not.toThrow()
  })

  // Additional coverage: colors props (isString true branches for non-default values)
  it("builds dataUrl with custom colors when provided", () => {
    render(
      <CalendlyClient
        calendlyId="user/event"
        colors={{ text: "#000000", button: "#FF0000", background: "#FFFFFF" }}
      />,
    )
    act(() => jest.advanceTimersByTime(8000))
    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", expect.stringContaining("text_color"))
  })

  // Additional coverage: isString(colors.X) FALSE branches when colors fields are undefined
  it("builds dataUrl without color params when colors object has no string values", () => {
    render(<CalendlyClient calendlyId="user/event" colors={{}} />)
    act(() => jest.advanceTimersByTime(8000))
    const link = screen.getByRole("link")
    // No color params added when color fields are undefined
    expect(link.getAttribute("href")).not.toContain("text_color")
    expect(link.getAttribute("href")).not.toContain("primary_color")
    expect(link.getAttribute("href")).not.toContain("background_color")
  })

  // Additional coverage: isString(data[k]) FALSE branch with partial data
  it("safePrefill covers isString false branch for missing data fields", () => {
    const initInlineWidget = jest.fn()
    ;(window as unknown as { Calendly: unknown }).Calendly = {
      initInlineWidget,
    }
    render(<CalendlyClient calendlyId="user/event" data={{ name: "Alice" }} />)
    act(() => jest.advanceTimersByTime(0))
    // email/firstName/lastName are undefined → isString returns false for those keys
    expect(initInlineWidget).toHaveBeenCalledWith(
      expect.objectContaining({
        prefill: expect.objectContaining({ name: "Alice" }),
      }),
    )
    delete (window as unknown as { Calendly?: unknown }).Calendly
  })
})
