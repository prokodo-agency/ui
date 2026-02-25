import type { AnimatedTextProps } from "@/components/animatedText"
import type { Schema } from "@/types/schema"
import type { Variants } from "@/types/variants"
import type { HTMLAttributes } from "react"

/**
 * Allowed HTML heading levels for Headline rendering.
 */
export type HeadlineTypeProps = "h1" | "h2" | "h3" | "h4" | "h5" | "h6"

/**
 * Predefined size tokens for headline typography.
 */
export type HeadlineSizeProps =
  | "xxl"
  | "xl"
  | "lg"
  | "md"
  | "sm"
  | "xs"
  | number

/**
 * Visual variants mapped to design system variants.
 */
export type HeadlineVariant = Variants

/**
 * Headline component props.
 * Renders semantic headings with optional animated text and RichText support.
 *
 * @example
 * <Headline type="h2" size="lg">
 *   Section title
 * </Headline>
 *
 * @example
 * <Headline type="h1" animated animationProps={{ delay: 100 }}>
 *   Animated title
 * </Headline>
 *
 * @a11y Use the correct `type` to preserve document heading hierarchy.
 * @ssr Fully SSR-safe (no browser-only APIs required).
 */
export type HeadlineProps = HTMLAttributes<HTMLHeadElement> & {
  /**
   * If true, wraps text nodes in `AnimatedText`.
   * Useful for headline entrance animations.
   */
  animated?: boolean
  /**
   * Props forwarded to `AnimatedText` (without children).
   */
  animationProps?: Omit<AnimatedTextProps, "children">

  /**
   * Which heading level (h1–h6) to render.
   * Defaults to h2 (component default).
   */
  type?: HeadlineTypeProps

  /**
   * Font size token (predefined scale).
   */
  size?: HeadlineSizeProps

  /**
   * Whether to highlight the text (design system accent).
   */
  highlight?: boolean

  /**
   * Microdata/schema attributes to attach to the headline element.
   */
  schema?: Schema

  /**
   * BEM modifier variant combined with size/variant styles.
   */
  variant?: HeadlineVariant

  /**
   * Additional CSS classes on the heading element.
   */
  className?: string

  /**
   * Text alignment.
   */
  align?: "left" | "center" | "right"

  /**
   * If true, treat children as raw Markdown and convert <p> to <hN>.
   */
  isRichtext?: boolean

  /**
   * Callback used by RichText when it encounters a <p>…</p>.
   * Should return a React element (typically a heading tag of the right level).
   */
  overrideParagraph?: (textContent: string) => React.ReactNode

  /**
   * Standard React node(s) to render inside the heading or RichText.
   */
  children?: React.ReactNode
}
