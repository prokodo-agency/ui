import type { HTMLAttributes, ReactElement, ReactNode } from "react"

export type TooltipAnchor = "element" | "pointer"
export type TooltipPlacement = "top" | "bottom" | "left" | "right"
export type TooltipOpenChangeEvent = (open: boolean) => void

/**
 * Trigger must be a single element that accepts standard HTML props,
 * because we clone it to merge className + aria + event handlers.
 */
export type TooltipTriggerElement = ReactElement<HTMLAttributes<HTMLElement>>

export type TooltipProps = {
  /**
   * Anchor mode:
   * - "element": anchor is the trigger element's center (default, stable).
   * - "pointer": anchor follows the last mouse position (useful for large targets).
   *
   * IMPORTANT:
   * For small icon buttons you almost always want "element".
   */
  anchor?: TooltipAnchor

  /**
   * Tooltip content. Keep it short.
   */
  content: ReactNode

  /**
   * Single trigger element (button/span/etc).
   * We clone it to add aria + event handlers.
   */
  children: TooltipTriggerElement

  /**
   * Optional stable id (otherwise uses React useId()).
   * Used for aria-describedby (we render a hidden described-by node).
   */
  id?: string

  /**
   * Preferred placement (may be adjusted on mobile and/or flipped if it would overflow).
   */
  placement?: TooltipPlacement

  /**
   * If true, clamps the tooltip into the viewport.
   * (With portal this is cheap and recommended.)
   */
  preventOverflow?: boolean

  /**
   * Render the visual tooltip into a portal (recommended).
   * Fixes "under other elements" and overflow clipping in complex layouts.
   */
  portal?: boolean

  /**
   * The id of the overlay root element. If missing, Tooltip creates it.
   */
  overlayRootId?: string

  /**
   * Z-index used for the portal bubble.
   */
  zIndex?: number

  /**
   * Pixel gap between trigger and bubble (excluding arrow).
   */
  offset?: number

  /**
   * Mobile breakpoint for placement adjustments.
   * Default matches $screen-lg (960).
   */
  mobileBreakpoint?: number

  /**
   * Disable tooltip entirely.
   */
  disabled?: boolean

  /**
   * Controlled open state (optional).
   */
  open?: boolean

  /**
   * Uncontrolled initial state (client only; will hydrate).
   */
  defaultOpen?: boolean

  /**
   * Notify open changes (client only).
   */
  onOpenChange?: TooltipOpenChangeEvent

  /**
   * Hover/focus open delay in ms (client only; will hydrate).
   */
  delay?: number

  /**
   * Close delay in ms (client only; will hydrate).
   */
  closeDelay?: number

  /**
   * Optional: allow hover open (default true).
   */
  openOnHover?: boolean

  /**
   * Optional: allow focus open (default true).
   */
  openOnFocus?: boolean

  /**
   * Styling hooks.
   */
  className?: string
  tooltipClassName?: string
  triggerClassName?: string

  /**
   * Extra props applied to the trigger element (merged safely).
   */
  triggerProps?: HTMLAttributes<HTMLElement>
}

/**
 * CSS vars used by the visual bubble (inline or portal).
 * - x/y are viewport coordinates for the bubble's top-left corner
 * - arrow-x/arrow-y position the arrow relative to the bubble
 */
export type TooltipViewBubbleStyle = React.CSSProperties & {
  ["--pk-tt-x"]?: string
  ["--pk-tt-y"]?: string
  ["--pk-tt-arrow-x"]?: string
  ["--pk-tt-arrow-y"]?: string
  ["--pk-tt-z"]?: string
}

export type TooltipViewProps = TooltipProps & {
  /**
   * Root wrapper ref (optional).
   */
  __rootRef?: React.RefObject<HTMLSpanElement | null>

  /**
   * Trigger element ref (used by client to compute portal positions).
   */
  __triggerRef?: React.RefObject<HTMLElement | null>

  /**
   * Inline bubble ref (server/CSS-only mode).
   */
  __bubbleRef?: React.RefObject<HTMLSpanElement | null>

  /**
   * Inline or portal bubble style (CSS vars).
   */
  __bubbleStyle?: TooltipViewBubbleStyle

  /**
   * If true, renders the visual bubble inside TooltipView.
   * If false, only renders the SR described-by node here (portal bubble elsewhere).
   */
  __renderVisualBubble?: boolean

  /**
   * When client controls open state.
   */
  __open?: boolean

  /**
   * When client adjusts placement (mobile/flip).
   */
  __placement?: TooltipPlacement

  /**
   * Stable tooltip id for aria-describedby + sr node.
   */
  __tooltipId?: string
}
