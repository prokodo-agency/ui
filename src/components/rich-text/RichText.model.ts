import type { AnimatedTextProps } from "@/components/animatedText"
import type { LinkProps } from "@/components/link"
import type { Schema } from "@/types/schema"
import type { Variants } from "@/types/variants"
import type { ReactNode, HTMLAttributes } from "react"

/**
 * RichTextProps
 *
 * - `children` is the raw Markdown string to parse.
 * - `animated` controls whether we wrap text nodes in `<AnimatedText>`.
 * - `animationProps` are forwarded to `<AnimatedText>`.
 * - `variant` controls icon/link coloring (passed via BEM-based CSS variables).
 * - `itemProp` gets added to each <p> tag for microdata.
 * - `linkComponent` lets you override which Link component to use.
 * - All other props (`...props`) are spread onto the outer <div>.
 */
export type RichTextProps = {
  /** Raw Markdown source. */
  children: ReactNode

  /** If true, wrap text in <AnimatedText>; otherwise render directly. */
  animated?: boolean

  /** Props forwarded to AnimatedText. */
  animationProps?: Omit<AnimatedTextProps, "children">

  /** BEM-variant for coloring (e.g. primary, secondary, etc.). */
  variant?: Variants

  /** Microdata attributes to spread on wrapper <div>. */
  schema?: Schema

  /** If provided, each <p> will include itemprop="...". */
  itemProp?: string

  /** Custom Link component (e.g. NextLink) to use instead of default <a>. */
  linkComponent?: LinkProps["linkComponent"]

  /** Optional CSS class on wrapper. */
  className?: string

  /**
   * Rel policy for links inside rich text.
   * Use "ugc" for user-generated content.
   */
  linkPolicy?: "ugc" | "trusted"

  /**
   * Callback used by RichText when it encounters a <p>…</p>.
   * Should return a React element—here, a heading tag of the right level.
   */
  overrideParagraph?: (textContent: string) => ReactNode

  /**
   * Control the Highlight.js stylesheet.
   * - Provide `href` to point to any CSS (absolute URL).
   * - Or provide `name` (e.g. "github", "atom-one-dark") and optional `version` ("auto" uses installed hljs version).
   * Default: { name: "github", version: "auto" }
   */
  codeTheme?: {
    /** Custom CSS URL for syntax highlighting. */
    href?: string
    /** Theme name (e.g. "github", "atom-one-dark"). */
    name?: string
    /** Theme version or "auto" to match installed HLJS. */
    version?: "auto" | string
  }
} & HTMLAttributes<HTMLDivElement>
