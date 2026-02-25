import { expect } from "@jest/globals"
import { createRef, type RefObject } from "react"

import { fireEvent, render, screen } from "@/tests"

import { TooltipView } from "./Tooltip.view"

jest.mock(
  "./Tooltip.module.scss",
  () => new Proxy({}, { get: (_t, k) => String(k) }),
)

describe("TooltipView", () => {
  const defaultProps = {
    content: "Tooltip text",
    children: <button>Trigger</button>,
  }

  it("renders the trigger child and SR tooltip", () => {
    render(<TooltipView {...defaultProps} />)
    expect(screen.getByRole("button", { name: "Trigger" })).toBeInTheDocument()
    // Both SR span and visual bubble render the content
    const [srSpan] = screen.getAllByText("Tooltip text")
    expect(srSpan).toBeInTheDocument()
  })

  it("adds aria-describedby to trigger when not disabled", () => {
    render(<TooltipView {...defaultProps} id="tt-1" />)
    const btn = screen.getByRole("button")
    expect(btn).toHaveAttribute("aria-describedby")
  })

  it("does NOT add aria-describedby when disabled", () => {
    render(<TooltipView {...defaultProps} disabled />)
    const btn = screen.getByRole("button")
    expect(btn).not.toHaveAttribute("aria-describedby")
    // SR span and visual bubble should not render either
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })

  it("renders visual bubble by default (__renderVisualBubble=true)", () => {
    render(<TooltipView {...defaultProps} __open={true} />)
    expect(screen.getByRole("tooltip")).toBeInTheDocument()
  })

  it("suppresses visual bubble when __renderVisualBubble=false", () => {
    render(<TooltipView {...defaultProps} __renderVisualBubble={false} />)
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })

  it("sets aria-hidden=false on bubble when __open=true", () => {
    render(<TooltipView {...defaultProps} __open={true} />)
    const bubble = screen.getByRole("tooltip")
    expect(bubble).toHaveAttribute("aria-hidden", "false")
  })

  it("sets aria-hidden=true on bubble when __open=false", () => {
    render(<TooltipView {...defaultProps} __open={false} />)
    // aria-hidden=true makes it inaccessible by role; use querySelector instead
    const bubble = document.querySelector('[role="tooltip"]')
    expect(bubble).not.toBeNull()
    expect(bubble).toHaveAttribute("aria-hidden", "true")
  })

  it("applies placement attribute", () => {
    render(<TooltipView {...defaultProps} placement="bottom" />)
    const root = screen.getByRole("button").closest("span")!
    expect(root).toHaveAttribute("data-placement", "bottom")
  })

  it("uses __placement over placement", () => {
    render(<TooltipView {...defaultProps} __placement="left" placement="top" />)
    const root = screen.getByRole("button").closest("span")!
    expect(root).toHaveAttribute("data-placement", "left")
  })

  it("merges className from child and triggerClassName", () => {
    render(
      <TooltipView {...defaultProps} triggerClassName="extra">
        <button className="child-cls">Trigger</button>
      </TooltipView>,
    )
    const btn = screen.getByRole("button")
    expect(btn).toHaveClass("child-cls")
  })

  it("calls both child and triggerProps event handlers (compose)", () => {
    const childEnter = jest.fn()
    const triggerEnter = jest.fn()

    render(
      <TooltipView
        {...defaultProps}
        triggerProps={{ onMouseEnter: triggerEnter }}
      >
        <button onMouseEnter={childEnter}>Trigger</button>
      </TooltipView>,
    )

    fireEvent.mouseEnter(screen.getByRole("button"))
    expect(childEnter).toHaveBeenCalledTimes(1)
    expect(triggerEnter).toHaveBeenCalledTimes(1)
  })

  it("calls both child and triggerProps blur handlers (compose onBlur)", () => {
    const childBlur = jest.fn()
    const triggerBlur = jest.fn()

    render(
      <TooltipView {...defaultProps} triggerProps={{ onBlur: triggerBlur }}>
        <button onBlur={childBlur}>Trigger</button>
      </TooltipView>,
    )

    fireEvent.blur(screen.getByRole("button"))
    expect(childBlur).toHaveBeenCalledTimes(1)
    expect(triggerBlur).toHaveBeenCalledTimes(1)
  })

  it("calls both child and triggerProps focus handlers (compose onFocus)", () => {
    const childFocus = jest.fn()
    const triggerFocus = jest.fn()

    render(
      <TooltipView {...defaultProps} triggerProps={{ onFocus: triggerFocus }}>
        <button onFocus={childFocus}>Trigger</button>
      </TooltipView>,
    )

    fireEvent.focus(screen.getByRole("button"))
    expect(childFocus).toHaveBeenCalledTimes(1)
    expect(triggerFocus).toHaveBeenCalledTimes(1)
  })

  it("calls both child and triggerProps keydown handlers (compose onKeyDown)", () => {
    const childKeyDown = jest.fn()
    const triggerKeyDown = jest.fn()

    render(
      <TooltipView
        {...defaultProps}
        triggerProps={{ onKeyDown: triggerKeyDown }}
      >
        <button onKeyDown={childKeyDown}>Trigger</button>
      </TooltipView>,
    )

    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" })
    expect(childKeyDown).toHaveBeenCalledTimes(1)
    expect(triggerKeyDown).toHaveBeenCalledTimes(1)
  })

  it("calls both child and triggerProps mouseleave handlers (compose onMouseLeave)", () => {
    const childLeave = jest.fn()
    const triggerLeave = jest.fn()

    render(
      <TooltipView
        {...defaultProps}
        triggerProps={{ onMouseLeave: triggerLeave }}
      >
        <button onMouseLeave={childLeave}>Trigger</button>
      </TooltipView>,
    )

    fireEvent.mouseLeave(screen.getByRole("button"))
    expect(childLeave).toHaveBeenCalledTimes(1)
    expect(triggerLeave).toHaveBeenCalledTimes(1)
  })

  it("forwards ref via setRef (function ref)", () => {
    const capturedRef = { current: null as HTMLButtonElement | null }
    const refFn = (node: HTMLButtonElement | null) => {
      capturedRef.current = node
    }

    render(
      <TooltipView {...defaultProps}>
        <button ref={refFn}>Trigger</button>
      </TooltipView>,
    )

    expect(capturedRef.current).not.toBeNull()
    expect(capturedRef.current?.tagName).toBe("BUTTON")
  })

  it("forwards ref via setRef (object ref)", () => {
    const ref = createRef<HTMLButtonElement>()

    render(
      <TooltipView {...defaultProps}>
        <button ref={ref}>Trigger</button>
      </TooltipView>,
    )

    expect(ref.current).not.toBeNull()
    expect(ref.current?.tagName).toBe("BUTTON")
  })

  it("provides __triggerRef to internal ref callback", () => {
    const triggerRef: RefObject<HTMLElement | null> = { current: null }

    render(<TooltipView {...defaultProps} __triggerRef={triggerRef} />)

    expect(triggerRef.current).not.toBeNull()
    expect(triggerRef.current?.tagName).toBe("BUTTON")
  })

  it("applies custom className to root", () => {
    render(<TooltipView {...defaultProps} className="custom-root" />)
    const root = screen.getByRole("button").closest("span")!
    expect(root.className).toContain("custom-root")
  })

  it("applies disabled class when disabled", () => {
    render(<TooltipView {...defaultProps} disabled />)
    const root = screen.getByRole("button").closest("span")!
    // bem('disabled') modifier is applied
    expect(root.className).toContain("disabled")
  })

  it("applies custom triggerProps style", () => {
    render(
      <TooltipView
        {...defaultProps}
        triggerProps={{ style: { display: "block", color: "red" } }}
      />,
    )
    const btn = screen.getByRole("button")
    expect(btn).toHaveStyle({ color: "red" })
  })

  it("uses __tooltipId when provided", () => {
    render(<TooltipView {...defaultProps} __tooltipId="custom-tooltip-id" />)
    const btn = screen.getByRole("button")
    expect(btn).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining("custom-tooltip-id"),
    )
  })

  it("sets __bubbleRef on bubble span", () => {
    const bubbleRef: RefObject<HTMLSpanElement | null> = { current: null }
    render(
      <TooltipView {...defaultProps} __bubbleRef={bubbleRef} __open={true} />,
    )
    expect(bubbleRef.current).not.toBeNull()
    expect(bubbleRef.current?.tagName).toBe("SPAN")
  })
})
