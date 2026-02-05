import type { ReactNode } from "react"

/**
 * Animation trigger configuration for scroll-based entrance animations.
 * Observes visibility in viewport and animates when element comes into view.
 *
 * @example
 * ```tsx
 * <Animated animation="bottom-top" delay={200} speed="fast">
 *   <Card>Content fades in from bottom</Card>
 * </Animated>
 * ```
 */
export type AnimatedProps = {
  /** CSS class on root container. */
  className?: string
  /** Disable animation (render normally). */
  disabled?: boolean
  /**
   * Animation direction:
   * - "bottom-top": Slide up from bottom.
   * - "top-bottom": Slide down from top.
   * - "left-right": Slide right from left.
   * - "right-left": Slide left from right.
   */
  animation?: "bottom-top" | "top-bottom" | "left-right" | "right-left"
  /** Delay before animation starts (ms). */
  delay?: number
  /** Intersection Observer threshold (0-1, percent of element visible). */
  threshold?: number
  /** Animation duration ("fast" or "slow"). */
  speed?: "fast" | "slow"
  /** Element content. */
  children?: ReactNode
  /** Custom IntersectionObserver options. */
  intersectionObserverOptions?: IntersectionObserverInit
  /** Callback fired when visibility changes. */
  onAnimate?: (visible: boolean) => void
}

/**
 * Internal view props with computed visibility state.
 * Used by Animated.view (not part of public API).
 */
export interface AnimatedViewProps
  extends Omit<
    AnimatedProps,
    "delay" | "intersectionObserverOptions" | "onAnimate"
  > {
  /** Current visibility state (element in viewport). */
  isVisible: boolean
}
