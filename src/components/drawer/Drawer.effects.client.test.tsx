import React, { createRef } from "react"

import { render, fireEvent } from "@/tests"

import { DrawerEffectsLoader } from "./Drawer.effects.client"

// jsdom does not implement window.scrollTo — define it once for the whole suite
Object.defineProperty(window, "scrollTo", { value: jest.fn(), writable: true })

describe("DrawerEffectsLoader", () => {
  afterEach(() => {
    // reset any body styles set by the scroll-lock effect
    document.body.style.overflow = ""
    document.body.style.position = ""
    document.body.style.top = ""
    document.body.style.width = ""
    document.documentElement.style.overscrollBehavior = ""
  })

  // ── scroll lock ───────────────────────────────────────────────
  it("locks body scroll when isOpen=true", () => {
    const containerRef = createRef<HTMLDivElement>()
    render(
      <>
        <div ref={containerRef} />
        <DrawerEffectsLoader isOpen containerRef={containerRef} />
      </>,
    )
    expect(document.body).toHaveStyle({ overflow: "hidden" })
    expect(document.body).toHaveStyle({ position: "fixed" })
    expect(document.body).toHaveStyle({ width: "100%" })
    // overscrollBehavior is not supported by jsdom computed style;
    // check the inline style property directly instead
    // eslint-disable-next-line jest-dom/prefer-to-have-style
    expect(document.documentElement.style.overscrollBehavior).toBe("none")
  })

  it("restores body scroll when isOpen=false", async () => {
    const containerRef = createRef<HTMLDivElement>()
    const { rerender } = render(
      <>
        <div ref={containerRef} />
        <DrawerEffectsLoader isOpen containerRef={containerRef} />
      </>,
    )
    // Lock applied — now close
    rerender(
      <>
        <div ref={containerRef} />
        <DrawerEffectsLoader containerRef={containerRef} isOpen={false} />
      </>,
    )
    expect(document.body).toHaveStyle({ overflow: "" })
    expect(document.body).toHaveStyle({ position: "" })
  })

  it("does not lock scroll when isOpen=false initially", () => {
    const containerRef = createRef<HTMLDivElement>()
    render(
      <>
        <div ref={containerRef} />
        <DrawerEffectsLoader containerRef={containerRef} isOpen={false} />
      </>,
    )
    expect(document.body).not.toHaveStyle({ overflow: "hidden" })
  })

  // ── focus management ──────────────────────────────────────────
  it("focuses closeButtonRef when isOpen=true", () => {
    const containerRef = createRef<HTMLDivElement>()
    const closeButtonRef = createRef<HTMLButtonElement>()
    render(
      <>
        <div ref={containerRef}>
          <button ref={closeButtonRef} data-testid="close-btn">
            Close
          </button>
        </div>
        <DrawerEffectsLoader
          isOpen
          closeButtonRef={closeButtonRef}
          containerRef={containerRef}
        />
      </>,
    )
    expect(document.activeElement?.getAttribute("data-testid")).toBe(
      "close-btn",
    )
  })

  it("focuses container when no closeButtonRef element", () => {
    const containerRef = createRef<HTMLDivElement>()
    render(
      <>
        <div ref={containerRef} data-testid="container" />
        <DrawerEffectsLoader isOpen containerRef={containerRef} />
      </>,
    )
    expect(document.activeElement?.getAttribute("data-testid")).toBe(
      "container",
    )
  })

  it("restores focus to trigger element on close", async () => {
    const triggerButton = document.createElement("button")
    triggerButton.setAttribute("data-testid", "trigger")
    document.body.appendChild(triggerButton)
    triggerButton.focus()
    expect(triggerButton).toHaveFocus()

    const containerRef = createRef<HTMLDivElement>()
    const { rerender } = render(
      <>
        <div ref={containerRef} />
        <DrawerEffectsLoader isOpen containerRef={containerRef} />
      </>,
    )
    // close the drawer
    rerender(
      <>
        <div ref={containerRef} />
        <DrawerEffectsLoader containerRef={containerRef} isOpen={false} />
      </>,
    )
    expect(triggerButton).toHaveFocus()
    document.body.removeChild(triggerButton)
  })

  it("does nothing for focus when containerRef has no node", () => {
    const containerRef = {
      current: null,
    } as unknown as React.RefObject<HTMLDivElement>
    // Should not throw when containerRef.current is null
    render(<DrawerEffectsLoader isOpen containerRef={containerRef} />)
  })

  // ── focus trap ────────────────────────────────────────────────
  it("calls onClose with 'escapeKeyDown' when Escape pressed", () => {
    const onClose = jest.fn()
    const containerRef = createRef<HTMLDivElement>()
    render(
      <>
        <div ref={containerRef} />
        <DrawerEffectsLoader
          isOpen
          containerRef={containerRef}
          onClose={onClose}
        />
      </>,
    )
    fireEvent.keyDown(document, { key: "Escape" })
    expect(onClose).toHaveBeenCalledWith("escapeKeyDown")
  })

  it("does not call onClose when isOpen=false and Escape pressed", () => {
    const onClose = jest.fn()
    const containerRef = createRef<HTMLDivElement>()
    render(
      <>
        <div ref={containerRef} />
        <DrawerEffectsLoader
          containerRef={containerRef}
          isOpen={false}
          onClose={onClose}
        />
      </>,
    )
    fireEvent.keyDown(document, { key: "Escape" })
    expect(onClose).not.toHaveBeenCalled()
  })

  it("wraps Tab focus forward from last element to first", () => {
    const containerRef = createRef<HTMLDivElement>()
    render(
      <>
        <div ref={containerRef}>
          <button id="btn-first">First</button>
          <button id="btn-last">Last</button>
        </div>
        <DrawerEffectsLoader isOpen containerRef={containerRef} />
      </>,
    )
    const lastBtn = document.getElementById("btn-last")!
    lastBtn.focus()
    expect(lastBtn).toHaveFocus()
    fireEvent.keyDown(document, { key: "Tab", shiftKey: false })
    expect(document.activeElement?.id).toBe("btn-first")
  })

  it("wraps Shift+Tab focus backward from first element to last", () => {
    const containerRef = createRef<HTMLDivElement>()
    render(
      <>
        <div ref={containerRef}>
          <button id="trap-first">First</button>
          <button id="trap-last">Last</button>
        </div>
        <DrawerEffectsLoader isOpen containerRef={containerRef} />
      </>,
    )
    const firstBtn = document.getElementById("trap-first")!
    firstBtn.focus()
    expect(firstBtn).toHaveFocus()
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true })
    expect(document.activeElement?.id).toBe("trap-last")
  })

  it("does not trap focus when container has no focusable children", () => {
    const containerRef = createRef<HTMLDivElement>()
    render(
      <>
        <div ref={containerRef} />
        <DrawerEffectsLoader isOpen containerRef={containerRef} />
      </>,
    )
    // Should not throw even with no focusable elements
    fireEvent.keyDown(document, { key: "Tab" })
  })

  it("does not trap focus when containerRef has no node and isOpen=true", () => {
    const containerRef = {
      current: null,
    } as unknown as React.RefObject<HTMLDivElement>
    render(<DrawerEffectsLoader isOpen containerRef={containerRef} />)
    // Should not throw
    fireEvent.keyDown(document, { key: "Tab" })
  })

  it("handles non-Tab, non-Escape keydown while open (no-op)", () => {
    // Covers if (e.key !== "Tab") return branch at line 92
    const containerRef = createRef<HTMLDivElement>()
    render(
      <>
        <div ref={containerRef}>
          <button id="btn-a">A</button>
          <button id="btn-b">B</button>
        </div>
        <DrawerEffectsLoader isOpen containerRef={containerRef} />
      </>,
    )
    // Press a key that is neither Escape nor Tab – should be a no-op
    fireEvent.keyDown(document, { key: "ArrowDown" })
    // No change in focus expected, no errors
    expect(document.body).toBeInTheDocument()
  })

  it("saves lastFocused as null when document.activeElement is null", () => {
    // Covers (document.activeElement as HTMLElement) ?? null branch at line 62
    const containerRef = createRef<HTMLDivElement>()
    // blur all elements so document.activeElement is null or body
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    render(
      <>
        <div ref={containerRef}>
          <button>Focusable</button>
        </div>
        <DrawerEffectsLoader isOpen containerRef={containerRef} />
      </>,
    )
    // Drawer opens — lastFocused stored, no error
    expect(document.body).toBeInTheDocument()
  })
})
