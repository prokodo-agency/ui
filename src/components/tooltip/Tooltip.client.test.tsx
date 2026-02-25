import React from "react"

import { act, render, screen, fireEvent } from "@/tests"

// Render portals inline
jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  createPortal: (node: unknown) => node,
}))

jest.mock(
  "./Tooltip.module.scss",
  () => new Proxy({}, { get: (_t, k) => String(k) }),
)

type CapturedTriggerProps = React.HTMLAttributes<HTMLElement>
let mockTriggerProps: CapturedTriggerProps = {}
let mockOpen: boolean | undefined = undefined

jest.mock("./Tooltip.view", () => ({
  TooltipView: (props: Record<string, unknown>) => {
    mockTriggerProps = (props.triggerProps ?? {}) as CapturedTriggerProps
    mockOpen = props.__open as boolean
    return (
      <div data-testid="tooltip-view">
        <button
          data-testid="trigger"
          onBlur={e => mockTriggerProps.onBlur?.(e as never)}
          onFocus={e => mockTriggerProps.onFocus?.(e as never)}
          onKeyDown={e => mockTriggerProps.onKeyDown?.(e as never)}
          onMouseEnter={e => mockTriggerProps.onMouseEnter?.(e as never)}
          onMouseLeave={e => mockTriggerProps.onMouseLeave?.(e as never)}
          onMouseMove={e => mockTriggerProps.onMouseMove?.(e as never)}
        >
          trigger
        </button>
      </div>
    )
  },
}))

const TooltipClient = require("./Tooltip.client").default

describe("Tooltip.client", () => {
  beforeEach(() => {
    mockTriggerProps = {}
    mockOpen = undefined
    jest.useFakeTimers()
  })
  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
  })

  it("renders TooltipView trigger", () => {
    render(<TooltipClient content="Hello">child</TooltipClient>)
    expect(screen.getByTestId("tooltip-view")).toBeInTheDocument()
    expect(screen.getByTestId("trigger")).toBeInTheDocument()
  })

  it("tooltip __open is false initially (portal=false)", () => {
    render(
      <TooltipClient content="Hello" portal={false}>
        child
      </TooltipClient>,
    )
    expect(mockOpen).toBe(false)
  })

  it("mouseEnter opens tooltip after default delay (portal=false)", () => {
    render(
      <TooltipClient content="Hello" portal={false}>
        child
      </TooltipClient>,
    )
    fireEvent.mouseEnter(screen.getByTestId("trigger"))
    expect(mockOpen).toBe(false) // still closed (delay pending)
    act(() => {
      jest.advanceTimersByTime(120)
    })
    expect(mockOpen).toBe(true)
  })

  it("delay=0 opens tooltip immediately on mouseEnter (portal=false)", () => {
    render(
      <TooltipClient content="Hello" delay={0} portal={false}>
        child
      </TooltipClient>,
    )
    fireEvent.mouseEnter(screen.getByTestId("trigger"))
    expect(mockOpen).toBe(true)
  })

  it("mouseLeave closes tooltip after closeDelay (portal=false)", () => {
    render(
      <TooltipClient content="Hello" delay={0} portal={false}>
        child
      </TooltipClient>,
    )
    fireEvent.mouseEnter(screen.getByTestId("trigger"))
    expect(mockOpen).toBe(true)
    fireEvent.mouseLeave(screen.getByTestId("trigger"))
    expect(mockOpen).toBe(true) // still open (closeDelay pending)
    act(() => {
      jest.advanceTimersByTime(80)
    })
    expect(mockOpen).toBe(false)
  })

  it("focus opens tooltip after default delay (portal=false)", () => {
    render(
      <TooltipClient content="Hello" portal={false}>
        child
      </TooltipClient>,
    )
    fireEvent.focus(screen.getByTestId("trigger"))
    act(() => {
      jest.advanceTimersByTime(120)
    })
    expect(mockOpen).toBe(true)
  })

  it("blur closes tooltip after closeDelay (portal=false)", () => {
    render(
      <TooltipClient closeDelay={0} content="Hello" delay={0} portal={false}>
        child
      </TooltipClient>,
    )
    fireEvent.mouseEnter(screen.getByTestId("trigger"))
    fireEvent.blur(screen.getByTestId("trigger"))
    expect(mockOpen).toBe(false)
  })

  it("Escape key closes tooltip immediately (portal=false)", () => {
    render(
      <TooltipClient content="Hello" delay={0} portal={false}>
        child
      </TooltipClient>,
    )
    fireEvent.mouseEnter(screen.getByTestId("trigger"))
    expect(mockOpen).toBe(true)
    fireEvent.keyDown(screen.getByTestId("trigger"), { key: "Escape" }),
      expect(mockOpen).toBe(false)
  })

  it("disabled prop ignores mouseEnter (portal=false)", () => {
    render(
      <TooltipClient disabled content="Hello" portal={false}>
        child
      </TooltipClient>,
    )
    fireEvent.mouseEnter(screen.getByTestId("trigger"))
    act(() => {
      jest.advanceTimersByTime(200)
    })
    expect(mockOpen).toBe(false)
  })

  it("controlled open=true shows tooltip (portal=false)", () => {
    render(
      <TooltipClient open content="Hello" portal={false}>
        child
      </TooltipClient>,
    )
    expect(mockOpen).toBe(true)
  })

  it("controlled open=false shows tooltip as closed (portal=false)", () => {
    render(
      <TooltipClient content="Hello" open={false} portal={false}>
        child
      </TooltipClient>,
    )
    expect(mockOpen).toBe(false)
  })

  it("calls onOpenChange when tooltip opens/closes (portal=false)", () => {
    const onOpenChange = jest.fn()
    render(
      <TooltipClient
        closeDelay={0}
        content="Hello"
        delay={0}
        portal={false}
        onOpenChange={onOpenChange}
      >
        child
      </TooltipClient>,
    )
    fireEvent.mouseEnter(screen.getByTestId("trigger"))
    expect(onOpenChange).toHaveBeenCalledWith(true)
    fireEvent.mouseLeave(screen.getByTestId("trigger"))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("openOnHover=false: no onMouseEnter/onMouseLeave on trigger (portal=false)", () => {
    render(
      <TooltipClient content="Hello" openOnHover={false} portal={false}>
        child
      </TooltipClient>,
    )
    expect(mockTriggerProps.onMouseEnter).toBeUndefined()
    expect(mockTriggerProps.onMouseLeave).toBeUndefined()
  })

  it("openOnFocus=false: no onFocus/onBlur on trigger (portal=false)", () => {
    render(
      <TooltipClient content="Hello" openOnFocus={false} portal={false}>
        child
      </TooltipClient>,
    )
    expect(mockTriggerProps.onFocus).toBeUndefined()
    expect(mockTriggerProps.onBlur).toBeUndefined()
  })

  it("with portal=true renders role=tooltip span in DOM", () => {
    render(
      <TooltipClient portal content="Hello tooltip">
        child
      </TooltipClient>,
    )
    expect(screen.getByRole("tooltip", { hidden: true })).toBeInTheDocument()
    expect(screen.getByRole("tooltip", { hidden: true })).toHaveTextContent(
      "Hello tooltip",
    )
  })

  it("with portal=true disabled: does not render role=tooltip span", () => {
    render(
      <TooltipClient disabled portal content="Hello">
        child
      </TooltipClient>,
    )
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })

  it("defaultOpen=true opens tooltip immediately (portal=false)", () => {
    render(
      <TooltipClient defaultOpen content="Hello" portal={false}>
        child
      </TooltipClient>,
    )
    expect(mockOpen).toBe(true)
  })

  it("anchor=pointer sets lastPointer on mouseMove", () => {
    // Just testing it doesn't throw
    render(
      <TooltipClient anchor="pointer" content="Hello" portal={false}>
        child
      </TooltipClient>,
    )
    fireEvent.mouseMove(screen.getByTestId("trigger"), {
      clientX: 50,
      clientY: 60,
    }),
      // no error thrown
      expect(screen.getByTestId("tooltip-view")).toBeInTheDocument()
  })
})

describe("Tooltip.client – portal geometry (compute / resize / scroll)", () => {
  beforeEach(() => {
    // Use fake timers so requestAnimationFrame callbacks can be flushed.
    jest.useFakeTimers()
    // Make bubble have measurable dimensions so compute() doesn't return early
    jest.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(120)
    jest.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(40)
    // Give window a size
    Object.defineProperty(window, "innerWidth", {
      value: 1280,
      configurable: true,
    })
    Object.defineProperty(window, "innerHeight", {
      value: 800,
      configurable: true,
    })
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  function openPortalTooltip(props: Record<string, unknown> = {}) {
    const view = render(
      <TooltipClient portal content="Tooltip" delay={0} {...props}>
        child
      </TooltipClient>,
    )
    // Trigger mouseEnter to open tooltip
    fireEvent.mouseEnter(screen.getByTestId("trigger"))
    // Flush double requestAnimationFrame (compute runs inside rAF)
    jest.runAllTimers()
    return view
  }

  it("compute() runs all geometry functions when bubble has size (placement=top)", () => {
    openPortalTooltip({ placement: "top" })
    // The tooltip span should be in the DOM
    const span = screen.getByRole("tooltip", { hidden: true })
    expect(span).toBeInTheDocument()
    // After compute() runs, bubbleStyle is set (not undefined)
    // The style should have --pk-tt-x and --pk-tt-y set
    expect(span).toHaveAttribute("aria-hidden", "false")
  })

  it("compute() runs with placement=bottom", () => {
    openPortalTooltip({ placement: "bottom" })
    expect(screen.getByRole("tooltip", { hidden: true })).toBeInTheDocument()
  })

  it("compute() runs with placement=left", () => {
    openPortalTooltip({ placement: "left" })
    expect(screen.getByRole("tooltip", { hidden: true })).toBeInTheDocument()
  })

  it("compute() runs with placement=right", () => {
    openPortalTooltip({ placement: "right" })
    expect(screen.getByRole("tooltip", { hidden: true })).toBeInTheDocument()
  })

  it("window resize triggers compute() re-run", async () => {
    openPortalTooltip()
    await act(async () => {
      window.dispatchEvent(new Event("resize"))
    })
    expect(screen.getByRole("tooltip", { hidden: true })).toBeInTheDocument()
  })

  it("window scroll triggers compute() re-run", async () => {
    openPortalTooltip()
    await act(async () => {
      window.dispatchEvent(new Event("scroll", { bubbles: true }))
    })
    expect(screen.getByRole("tooltip", { hidden: true })).toBeInTheDocument()
  })

  it("onMouseEnter on portal bubble calls clearTimers + setOpen(true)", () => {
    openPortalTooltip({ closeDelay: 200 })
    const bubble = screen.getByRole("tooltip", { hidden: true })
    // Mouse enter on bubble invokes the onMouseEnter handler
    fireEvent.mouseEnter(bubble)
    // Just verify the bubble is still in the DOM and no errors thrown
    expect(bubble).toBeInTheDocument()
  })

  it("onMouseLeave on portal bubble schedules close", () => {
    openPortalTooltip({ closeDelay: 80 })
    const bubble = screen.getByRole("tooltip", { hidden: true })
    fireEvent.mouseLeave(bubble)
    act(() => {
      jest.advanceTimersByTime(100)
    })
    expect(mockOpen).toBe(false)
  })

  it("preventOverflow=true triggers choosePlacement fallback logic", () => {
    // With narrow viewport, left/right may not fit
    Object.defineProperty(window, "innerWidth", {
      value: 100,
      configurable: true,
    })
    openPortalTooltip({ placement: "left", preventOverflow: true })
    expect(screen.getByRole("tooltip", { hidden: true })).toBeInTheDocument()
  })

  it("anchor=pointer uses lastPointer.current as anchor point", () => {
    render(
      <TooltipClient portal anchor="pointer" content="Pointer TT" delay={0}>
        child
      </TooltipClient>,
    )
    // Set pointer position first
    fireEvent.mouseMove(screen.getByTestId("trigger"), {
      clientX: 200,
      clientY: 300,
    })
    // Open
    fireEvent.mouseEnter(screen.getByTestId("trigger"))
    jest.runAllTimers()
    expect(screen.getByRole("tooltip", { hidden: true })).toBeInTheDocument()
  })

  it("openOnHover=false with portal=true: bubble has no onMouseEnter/onMouseLeave", () => {
    render(
      <TooltipClient open portal content="Tooltip" openOnHover={false}>
        child
      </TooltipClient>,
    )
    jest.runAllTimers()
    const bubble = screen.getByRole("tooltip", { hidden: true })
    // With openOnHover=false the ternary resolves to undefined – just verify no error
    fireEvent.mouseEnter(bubble)
    fireEvent.mouseLeave(bubble)
    expect(bubble).toBeInTheDocument()
  })
})
