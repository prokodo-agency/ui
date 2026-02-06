import type { AvatarProps } from "../avatar"
import type { HeadlineProps } from "../headline"
import type { Variants } from "@/types/variants"

/**
 * Headline content definition for Quote.
 */
export type QuoteHeadline = {
  /** Headline text content. */
  content: string
} & Omit<HeadlineProps, "children">

/**
 * Author metadata for a quote.
 */
export type QuoteAuthor = {
  /** Optional avatar props. */
  avatar?: AvatarProps
  /** Author name. */
  name: string
  /** Author role/position. */
  position?: string
}

/**
 * Quote component props.
 * Renders a quotation with optional title, subtitle and author info.
 *
 * @example
 * <Quote
 *   title={{ content: "What users say" }}
 *   content="Great product!"
 *   author={{ name: "Alex", position: "CEO" }}
 * />
 */
export type QuoteProps = {
  /** Root class name. */
  className?: string
  /** Visual variant token. */
  variant?: Variants
  /** Optional title headline. */
  title?: QuoteHeadline
  /** Optional subtitle headline. */
  subTitle?: QuoteHeadline
  /** Quote body text. */
  content: string
  /** Optional author info. */
  author?: QuoteAuthor
}
