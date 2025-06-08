import type { AnimatedTextProps } from "@/components/animatedText"
import type { Schema } from "@/types/schema"
import type { Variants } from "@/types/variants"
import type { HTMLAttributes } from "react"

export type HeadlineTypeProps = "h1" | "h2" | "h3" | "h4" | "h5" | "h6"

export type HeadlineSizeProps = "xxl" | "xl" | "lg" | "md" | "sm" | "xs"

export type HeadlineVariant = Variants

export type HeadlineProps = HTMLAttributes<HTMLHeadElement> & {
  /** If true, wrap text nodes in AnimatedText */
  animated?: boolean
  /** Props forwarded to AnimatedText */
  animationProps?: Omit<AnimatedTextProps, "children">

  /** Which heading level (h1, h2, …, h6) to render */
  type?: HeadlineTypeProps

  /** Font size modifier string (predefined) or number (em units) */
  size?: HeadlineSizeProps

  /** Whether to highlight the text (boolean) */
  highlight?: boolean

  /** Microdata/schema attributes */
  schema?: Schema

  /** BEM modifier (combined with size/variant) */
  variant?: HeadlineVariant

  /** Additional CSS classes on the heading */
  className?: string

  /** Text alignment, e.g. "center", "right" */
  align?: "left" | "center" | "right"

  /** If true, treat children as raw Markdown and convert <p> to <hN> */
  isRichtext?: boolean

  /**
   * Callback used by RichText when it encounters a <p>…</p>.
   * Should return a React element—here, a heading tag of the right level.
   */
  overrideParagraph?: (textContent: string) => React.ReactNode

  /** Standard React node(s) to render inside the heading or RichText */
  children?: React.ReactNode
}
