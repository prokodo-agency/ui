import type { HTMLAttributes } from "react"

/**
 * Animated text typing effect component props.
 * Character-by-character reveal animation.
 *
 * @example
 * ```tsx
 * <AnimatedText delay={100} speed={30}>
 *   Hello, World!
 * </AnimatedText>
 * ```
 *
 * @a11y Text is fully visible to screen readers (aria attributes handle timing).
 * @ssr Can be prerendered; animation only runs on client.
 */
export type AnimatedTextProps = HTMLAttributes<HTMLSpanElement> & {
  /** Initial delay before animation starts (ms). */
  delay?: number
  /** Delay between character reveals (ms). */
  speed?: number
  /** Disable animation (render text immediately). */
  disabled?: boolean
  /** Text content to animate. */
  children: string
}

/**
 * Internal view props with computed current text.
 * Used by AnimatedText.view (not part of public API).
 */
export type AnimatedTextViewProps = Omit<AnimatedTextProps, "children"> & {
  /** Current substring visible (animated character progression). */
  text: string
}
