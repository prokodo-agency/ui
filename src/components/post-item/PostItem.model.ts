import type { ButtonProps } from "../button"
import type { CardProps } from "../card"
import type { HeadlineProps } from "../headline"
import type { ImageProps } from "../image"
import type { PostItemAuthorProps } from "./PostItemAuthor.model"

/**
 * Headline content definition for PostItem.
 */
export type PostItemHeadline = {
  /** Headline text content. */
  content: string
} & Omit<HeadlineProps, "children">

/**
 * Class name overrides for PostItem sub-elements.
 */
export type PostItemClasses = {
  root?: string
  grid?: string
  main?: string
  media?: string
  animation?: string
  headline?: string
  info?: string
  date?: string
  readingTime?: string
  readCount?: string
  contentParagraph?: string
  button?: string
  buttonContent?: string
  imageWrapper?: string
  imageContentWrapper?: string
}

/**
 * Per-component prop overrides for PostItem.
 */
export type PostItemComponentsProps = {
  card?: Partial<CardProps>
  headline?: Partial<HeadlineProps>
  button?: Partial<ButtonProps>
  image?: Partial<ImageProps>
  author?: Partial<PostItemAuthorProps>
}

// --- Conditional date/locale ---
/**
 * Post item with localized date formatting.
 */
export type PostItemWithDate = {
  /** ISO date string. */
  date: string
  /** Locale(s) used for date formatting. */
  locale: Intl.LocalesArgument
}

/**
 * Post item without date info.
 */
export type PostItemWithoutDate = {
  date?: undefined
  locale?: never
}
// --------------------------------

// Props visible to users of the component
/**
 * Base PostItem props.
 * Renders a blog/article preview card with optional metadata.
 *
 * @example
 * <PostItem
 *   title={{ content: "Hello World" }}
 *   category="News"
 *   content="Short excerpt..."
 *   date="2025-10-01"
 *   locale="de-DE"
 * />
 */
export type PostItemPropsBase = {
  /** Root class name. */
  className?: string
  /** Class overrides for sub-elements. */
  classes?: PostItemClasses
  /** Component-level prop overrides. */
  componentsProps?: PostItemComponentsProps
  /** Word count for reading time calculation. */
  wordCount?: number
  /** Number of reads (display only). */
  readCount?: number
  /** Title/headline config. */
  title: PostItemHeadline
  /** Author info. */
  author?: PostItemAuthorProps
  /** Category label. */
  category?: string
  /** Main excerpt content. */
  content?: string
  /** Meta date text (pre-formatted). */
  metaDate?: string
  /** Image URL. */
  image?: string
  /** Optional CTA button props. */
  button?: ButtonProps
  /** Toggle JSON-LD structured data output. */
  structuredData?: boolean
  /** Words per minute for reading time calculation. */
  readingWpm?: number
  /** Enable entry animations. */
  animate?: boolean
}

/**
 * Full PostItem props, including conditional date/locale.
 */
export type PostItemProps = PostItemPropsBase &
  (PostItemWithDate | PostItemWithoutDate)

// Private props only used between Server/Client/View
/**
 * Private view props for derived values.
 */
export type PostItemViewPrivateProps = {
  /** Calculated reading time in minutes. */
  readMinutes: number
}
