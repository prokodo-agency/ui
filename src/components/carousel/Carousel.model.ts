import type { PREV, NEXT } from "./Carousel.services"
import type { ButtonProps } from "../button"
import type { Breakpoints, BreakpointKey } from "@/hooks/useResponsiveValue"
import type { Ref, ReactNode, CSSProperties, HTMLAttributes } from "react"

/**
 * Imperative ref handle for Carousel.
 * Allows programmatic control of slide navigation.
 */
export type CarouselRef = {
  /** Move to previous slide. */
  slidePrev: () => void
  /** Move to next slide. */
  slideNext: () => void
  /** Reference to carousel container DOM element. */
  carouselContainer: HTMLDivElement | null
}

/**
 * Responsive configuration for items-to-show value.
 * Supports multiple strategies: breakpoint-based, media query, or container width rules.
 */
export type CarouselResponsiveConfig = {
  /** Default items to show when no breakpoint matches. */
  fallback?: number
  /** Custom breakpoint object (xs, sm, md, lg, xl pixel thresholds). */
  breakpoints?: Breakpoints
  /** Map breakpoint keys to item counts. Example: { md: 3, lg: 4 }. */
  valuesByBreakpoint?: Partial<Record<BreakpointKey, number>>
  /** Media query string tuples with item counts. */
  valuesByQueries?: ReadonlyArray<readonly [string, number]>
  /** Container query width rules. */
  containerRules?: ReadonlyArray<{ min?: number; max?: number; value: number }>
}

/**
 * Carousel component props.
 * Horizontal slide container with autoplay, navigation controls, and indicators.
 *
 * @example
 * <Carousel itemsToShow={3} enableControl enableDots autoplay={5000}>
 *   <div>Slide 1</div>
 *   <div>Slide 2</div>
 * </Carousel>
 */
export type CarouselProps = HTMLAttributes<HTMLDivElement> & {
  /** Imperative ref for programmatic slide control. */
  ref?: Ref<CarouselRef>
  /** Auto-advance every N milliseconds. 0/undefined = disabled. */
  autoplay?: number
  /** Show prev/next navigation buttons. */
  enableControl?: boolean
  /** Show dot indicators for slides. */
  enableDots?: boolean
  /** Initial horizontal translation offset. */
  translateX?: string
  /** CSS properties for slide items. */
  itemStyle?: CSSProperties
  /** Number of visible slides at once. */
  itemsToShow?: number
  /** Root container class name. */
  className?: string
  /** Controls wrapper class name. */
  classNameControls?: string
  /** Navigation button class name. */
  classNameButtons?: string
  /** Slides wrapper class name. */
  classNameWrapper?: string
  /** Individual slide item class name. */
  classNameItem?: string
  /** Dots container class name. */
  classNameDots?: string
  /** Dot indicator class name. */
  classNameDot?: string
  /** Active dot indicator class name. */
  classNameDotActive?: string
  /** Responsive configuration for breakpoints. */
  responsive?: CarouselResponsiveConfig
  /** Slide content. */
  children: ReactNode
  /** Props for previous button. */
  prevButton?: Partial<ButtonProps>
  /** Props for next button. */
  nextButton?: Partial<ButtonProps>
}

/** Navigation direction: "prev" or "next". */
export type CarouselDirection = typeof PREV | typeof NEXT
