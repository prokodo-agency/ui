import type { AnimatedProps } from "../animated"
import type { ImageProps } from "../image"
import type { LinkProps } from "../link"
import type { SkeletonProps } from "../skeleton"
import type { Variants } from "@/types/variants"
import type { StaticImageData } from "next/image"
import type { Ref, ReactNode, KeyboardEvent } from "react"

/** Visual variant: semantic styles or "panel" for flat appearance. */
export type CardVariant = Variants | "panel"

/**
 * Background image configuration for Card.
 * Extends Image props, supports responsive images via `next/image`.
 */
export type CardBackgroundProps = {
  /** Image source URL or Next.js static image import. */
  src?: string | StaticImageData
  /** Alt text for accessibility. Required for a11y when src is provided. */
  alt?: string
} & Omit<ImageProps, "src" | "alt" | "width" | "height">

/**
 * Card component props.
 * Flexible container supporting interactive states, animations, and optional link navigation.
 */
export type CardProps = {
  /** DOM ref to card container element. */
  ref?: Ref<HTMLDivElement>
  /** Visual variant (semantic color, neutral, panel). Defaults to "primary". */
  variant?: CardVariant
  /** Show skeleton overlay while loading. Requires `skeletonProps` for customization. */
  loading?: boolean
  /** Skeleton animation config. Only used when `loading=true`. */
  skeletonProps?: SkeletonProps
  /** Apply highlight/accent styling (semantic highlight color). */
  highlight?: boolean
  /** Apply gradient background overlay. Use `gradiantClassName` to customize color. */
  gradiant?: boolean
  /** Custom gradient class (e.g., gradient direction, colors). No effect if `gradiant=false`. */
  gradiantClassName?: string
  /** Apply box-shadow for depth. Default false. */
  enableShadow?: boolean
  /** Enable entrance animation (fade, slide). Pair with `animatedProps` for timing/delay. */
  animated?: boolean
  /** Animation timing config (duration, delay, easing). Only used when `animated=true`. */
  animatedProps?: AnimatedProps
  /** Custom animation direction. Ignored if `animated=false`. */
  customAnimation?: "bottom-top" | "top-bottom" | "left-right" | "right-left"
  /** Root element class name. */
  className?: string
  /** Content container class name. Wraps `children`. */
  contentClassName?: string
  /** Background color class or CSS variable. */
  background?: string
  /** Background image and Image props config. Appears behind content. */
  backgroundProps?: CardBackgroundProps
  /** Disable interaction, pointer events. Apply disabled styling. */
  disabled?: boolean
  /** Make entire card a clickable link. If set, disables `onClick`. SSR-safe (no hydration mismatch). */
  redirect?: LinkProps
  /** Card click handler. Ignored if `redirect` is set. */
  onClick?: () => void
  /** Keyboard event handler. Use for custom Enter/Space behavior; `redirect` takes precedence. */
  onKeyDown?: (e: KeyboardEvent) => void
  /** Mouse enter event (for hover animations, tooltips). */
  onMouseEnter?: () => void
  /** Mouse leave event. */
  onMouseLeave?: () => void
  /** Card content (text, images, nested components). */
  children: ReactNode
}
