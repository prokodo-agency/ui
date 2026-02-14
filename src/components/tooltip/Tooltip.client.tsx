"use client"

import {
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type JSX,
} from "react"
import { createPortal } from "react-dom"

import { create } from "@/helpers/bem"

import styles from "./Tooltip.module.scss"
import { TooltipView } from "./Tooltip.view"

import type { TooltipPlacement, TooltipProps } from "./Tooltip.model"

const bem = create(styles, "Tooltip")

type BubbleStyle = React.CSSProperties & {
  ["--pk-tt-x"]?: string
  ["--pk-tt-y"]?: string
  ["--pk-tt-arrow-x"]?: string
  ["--pk-tt-arrow-y"]?: string
  ["--pk-tt-z"]?: string
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

function getOverlayRoot(id: string, zIndex: number): HTMLElement {
  let el = document.getElementById(id)
  if (!el) {
    el = document.createElement("div")
    el.id = id
    document.body.appendChild(el)
  }

  // Overlay root must not create stacking/overflow issues.
  el.style.position = "fixed"
  el.style.left = "0"
  el.style.top = "0"
  el.style.width = "0"
  el.style.height = "0"
  el.style.pointerEvents = "none"
  el.style.zIndex = String(zIndex)

  return el
}

function opposite(p: TooltipPlacement): TooltipPlacement {
  if (p === "top") return "bottom"
  if (p === "bottom") return "top"
  if (p === "left") return "right"
  return "left"
}

function perpendicular(
  p: TooltipPlacement,
): [TooltipPlacement, TooltipPlacement] {
  // For top/bottom prefer right/left; for left/right prefer top/bottom.
  if (p === "top" || p === "bottom") return ["right", "left"]
  return ["top", "bottom"]
}

function fitsPlacement(args: {
  placement: TooltipPlacement
  anchorX: number
  anchorY: number
  triggerRect: DOMRect
  bubbleSize: { w: number; h: number }
  gutter: number
  offset: number
  arrowSize: number
}): boolean {
  const {
    placement,
    anchorX,
    anchorY,
    triggerRect,
    bubbleSize,
    gutter,
    offset,
    arrowSize,
  } = args

  const vw = window.innerWidth
  const vh = window.innerHeight
  const need = offset + arrowSize

  let left = 0
  let top = 0

  if (placement === "top") {
    left = anchorX - bubbleSize.w / 2
    top = triggerRect.top - need - bubbleSize.h
  } else if (placement === "bottom") {
    left = anchorX - bubbleSize.w / 2
    top = triggerRect.bottom + need
  } else if (placement === "left") {
    left = triggerRect.left - need - bubbleSize.w
    top = anchorY - bubbleSize.h / 2
  } else {
    left = triggerRect.right + need
    top = anchorY - bubbleSize.h / 2
  }

  const right = left + bubbleSize.w
  const bottom = top + bubbleSize.h

  return (
    left >= gutter &&
    right <= vw - gutter &&
    top >= gutter &&
    bottom <= vh - gutter
  )
}

function choosePlacement(args: {
  preferred: TooltipPlacement
  anchorX: number
  anchorY: number
  triggerRect: DOMRect
  bubbleSize: { w: number; h: number }
  gutter: number
  offset: number
  arrowSize: number
  preventOverflow: boolean
}): TooltipPlacement {
  const { preferred, preventOverflow } = args
  if (!preventOverflow) return preferred

  const tryOrder: TooltipPlacement[] = [
    preferred,
    opposite(preferred),
    ...perpendicular(preferred),
  ]

  for (const p of tryOrder) {
    if (fitsPlacement({ ...args, placement: p })) return p
  }

  // Nothing fits fully → keep preferred and let clamping handle it.
  return preferred
}

function computeFixedPosition(args: {
  placement: TooltipPlacement
  anchorX: number
  anchorY: number
  bubbleSize: { w: number; h: number }
  gutter: number
  offset: number
  arrowSize: number
}): { x: number; y: number; arrowX?: number; arrowY?: number } {
  const { placement, anchorX, anchorY, bubbleSize, gutter, offset, arrowSize } =
    args

  const vw = window.innerWidth
  const vh = window.innerHeight
  const need = offset + arrowSize

  let x = 0
  let y = 0

  if (placement === "top") {
    x = anchorX - bubbleSize.w / 2
    y = anchorY - need - bubbleSize.h
  } else if (placement === "bottom") {
    x = anchorX - bubbleSize.w / 2
    y = anchorY + need
  } else if (placement === "left") {
    x = anchorX - need - bubbleSize.w
    y = anchorY - bubbleSize.h / 2
  } else {
    x = anchorX + need
    y = anchorY - bubbleSize.h / 2
  }

  const clampedX = clamp(x, gutter, vw - gutter - bubbleSize.w)
  const clampedY = clamp(y, gutter, vh - gutter - bubbleSize.h)

  const pad = 12

  if (placement === "top" || placement === "bottom") {
    const rawArrowX = anchorX - clampedX
    const arrowX = clamp(
      rawArrowX,
      arrowSize + pad,
      bubbleSize.w - arrowSize - pad,
    )
    return { x: clampedX, y: clampedY, arrowX }
  }

  const rawArrowY = anchorY - clampedY
  const arrowY = clamp(
    rawArrowY,
    arrowSize + pad,
    bubbleSize.h - arrowSize - pad,
  )
  return { x: clampedX, y: clampedY, arrowY }
}

function TooltipClient(props: TooltipProps): JSX.Element {
  const {
    anchor = "element",

    content,
    preventOverflow = true,

    // Portal defaults.
    portal = true,
    overlayRootId = "pk-overlays",
    zIndex = 2147483647,
    offset = 6,
    mobileBreakpoint = 960,

    // Open logic.
    open: controlledOpen,
    defaultOpen,
    onOpenChange,
    delay = 120,
    closeDelay = 80,
    openOnHover = true,
    openOnFocus = true,
    disabled,

    // View.
    triggerProps,
    placement = "top",
    tooltipClassName,

    ...rest
  } = props

  const isControlled = controlledOpen !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = useState<boolean>(
    Boolean(defaultOpen),
  )
  const open = isControlled ? Boolean(controlledOpen) : uncontrolledOpen

  const lastPointer = useRef<{ x: number; y: number } | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const bubbleRef = useRef<HTMLSpanElement | null>(null)

  const [bubbleStyle, setBubbleStyle] = useState<BubbleStyle | undefined>(
    undefined,
  )
  const [effectivePlacement, setEffectivePlacement] =
    useState<TooltipPlacement>(placement)

  const openTimer = useRef<number | null>(null)
  const closeTimer = useRef<number | null>(null)

  const clearTimers = useCallback(() => {
    if (openTimer.current != null) window.clearTimeout(openTimer.current)
    if (closeTimer.current != null) window.clearTimeout(closeTimer.current)
    openTimer.current = null
    closeTimer.current = null
  }, [])

  const setOpen = useCallback(
    (next: boolean) => {
      if (disabled) return
      if (!isControlled) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [disabled, isControlled, onOpenChange],
  )

  const scheduleOpen = useCallback(() => {
    if (disabled) return
    clearTimers()
    if (delay <= 0) return setOpen(true)
    openTimer.current = window.setTimeout(() => setOpen(true), delay)
  }, [clearTimers, delay, disabled, setOpen])

  const scheduleClose = useCallback(() => {
    clearTimers()
    if (closeDelay <= 0) return setOpen(false)
    closeTimer.current = window.setTimeout(() => setOpen(false), closeDelay)
  }, [clearTimers, closeDelay, setOpen])

  const mergedTriggerProps = useMemo(
    () =>
      ({
        ...triggerProps,

        onMouseEnter: openOnHover
          ? (e: React.MouseEvent<HTMLElement>) => {
              triggerProps?.onMouseEnter?.(e)
              if (anchor === "pointer")
                lastPointer.current = { x: e.clientX, y: e.clientY }
              scheduleOpen()
            }
          : triggerProps?.onMouseEnter,

        onMouseLeave: openOnHover
          ? (e: React.MouseEvent<HTMLElement>) => {
              triggerProps?.onMouseLeave?.(e)
              const nextTarget = e.relatedTarget as Node | null
              if (nextTarget && bubbleRef.current?.contains(nextTarget)) return
              if (anchor === "pointer") lastPointer.current = null
              scheduleClose()
            }
          : triggerProps?.onMouseLeave,

        onMouseMove:
          anchor === "pointer"
            ? (e: React.MouseEvent<HTMLElement>) => {
                triggerProps?.onMouseMove?.(e)
                lastPointer.current = { x: e.clientX, y: e.clientY }
              }
            : triggerProps?.onMouseMove,

        onFocus: openOnFocus
          ? (e: React.FocusEvent<HTMLElement>) => {
              triggerProps?.onFocus?.(e)
              scheduleOpen()
            }
          : triggerProps?.onFocus,

        onBlur: openOnFocus
          ? (e: React.FocusEvent<HTMLElement>) => {
              triggerProps?.onBlur?.(e)
              scheduleClose()
            }
          : triggerProps?.onBlur,

        onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
          triggerProps?.onKeyDown?.(e)
          if (e.key === "Escape") {
            clearTimers()
            setOpen(false)
            ;(e.currentTarget as HTMLElement | null)?.blur?.()
          }
        },
      }) as React.HTMLAttributes<HTMLElement>,
    [
      triggerProps,
      openOnHover,
      openOnFocus,
      scheduleOpen,
      scheduleClose,
      clearTimers,
      setOpen,
      anchor,
    ],
  )

  // Base class used for measurement (stable: no placement/open modifiers).
  const portalBubbleClassBase = useMemo(
    () => bem("bubble", undefined, tooltipClassName),
    [tooltipClassName],
  )

  // Final class once we computed placement.
  const portalBubbleClassFinal = useMemo(
    () =>
      bem(
        "bubble",
        { open: Boolean(open && bubbleStyle), [effectivePlacement]: true },
        tooltipClassName,
      ),
    [open, bubbleStyle, effectivePlacement, tooltipClassName],
  )

  const compute = useCallback(() => {
    if (!portal || !open || disabled) return

    const triggerEl = triggerRef.current
    const bubbleEl = bubbleRef.current
    if (!triggerEl || !bubbleEl) return

    // use the REAL visual anchor inside the trigger (icon), not the (possibly stretched) button
    const anchorEl =
      triggerEl.querySelector<HTMLElement>("[data-tooltip-anchor]") ?? triggerEl

    const gutter = 8
    const arrowSize = 8

    const triggerRect = anchorEl.getBoundingClientRect()

    // IMPORTANT: use offsetWidth/offsetHeight so transforms (scale) do NOT affect measurement.
    const bubbleSize = {
      w: bubbleEl.offsetWidth,
      h: bubbleEl.offsetHeight,
    }
    if (!bubbleSize.w || !bubbleSize.h) return

    // Mobile: left/right -> top.
    const isMobile = window.innerWidth < mobileBreakpoint
    const preferred: TooltipPlacement =
      isMobile && (placement === "left" || placement === "right")
        ? "top"
        : placement

    // Anchor point (element center OR pointer).
    const ar = anchorEl.getBoundingClientRect()
    const anchorX = ar.left + ar.width / 2
    const anchorY = ar.top + ar.height / 2

    const chosen = choosePlacement({
      preferred,
      anchorX,
      anchorY,
      triggerRect,
      bubbleSize,
      gutter,
      offset,
      arrowSize,
      preventOverflow,
    })

    const { x, y, arrowX, arrowY } = computeFixedPosition({
      placement: chosen,
      anchorX,
      anchorY,
      bubbleSize,
      gutter,
      offset,
      arrowSize,
    })

    setEffectivePlacement(chosen)
    setBubbleStyle({
      ["--pk-tt-x"]: `${x}px`,
      ["--pk-tt-y"]: `${y}px`,
      ["--pk-tt-arrow-x"]: arrowX != null ? `${arrowX}px` : undefined,
      ["--pk-tt-arrow-y"]: arrowY != null ? `${arrowY}px` : undefined,
      ["--pk-tt-z"]: String(zIndex),
    })
  }, [
    portal,
    open,
    disabled,
    placement,
    preventOverflow,
    offset,
    zIndex,
    mobileBreakpoint,
  ])

  useLayoutEffect(() => {
    if (!portal || !open) return

    // Reset style so we don't flash at (0,0) on OPEN.
    setBubbleStyle(undefined)

    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => compute())
    })

    const onResize = () => compute()
    const onScroll = () => compute()

    window.addEventListener("resize", onResize)
    window.addEventListener("scroll", onScroll, true)

    return () => {
      cancelAnimationFrame(raf1)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("scroll", onScroll, true)
    }
  }, [portal, open, compute])

  const overlayRoot =
    typeof document !== "undefined" && portal
      ? getOverlayRoot(overlayRootId, zIndex)
      : null

  const portalOpen = open && Boolean(bubbleStyle)

  return (
    <>
      <TooltipView
        {...rest}
        __open={portal ? portalOpen : open}
        __placement={portal ? effectivePlacement : placement}
        __renderVisualBubble={!portal}
        __triggerRef={triggerRef}
        content={content}
        disabled={disabled}
        placement={placement}
        tooltipClassName={tooltipClassName}
        triggerProps={mergedTriggerProps}
      />

      {portal && !disabled && overlayRoot
        ? createPortal(
            <span
              ref={bubbleRef}
              aria-hidden={open === undefined ? undefined : !open}
              role="tooltip"
              style={bubbleStyle}
              className={
                bubbleStyle ? portalBubbleClassFinal : portalBubbleClassBase
              }
              onMouseEnter={
                openOnHover
                  ? () => {
                      clearTimers()
                      setOpen(true)
                    }
                  : undefined
              }
              onMouseLeave={
                openOnHover
                  ? () => {
                      scheduleClose()
                    }
                  : undefined
              }
            >
              {content}
            </span>,
            overlayRoot,
          )
        : null}
    </>
  )
}

export default memo(TooltipClient)
