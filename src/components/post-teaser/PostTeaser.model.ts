import type { CardProps } from "../card"
import type { ChipProps } from "../chip"
import type { HeadlineProps } from "../headline"
import type { IconProps } from "../icon"
import type { ImageProps } from "../image"
import type { LinkProps } from "../link"

/**
 * Headline content definition for PostTeaser.
 */
export type PostTeaserHeadline = {
  /** Headline text content. */
  content: string
} & Omit<HeadlineProps, "children">

/**
 * Image props for the teaser media.
 */
export type PostTeaserImage = ImageProps

/**
 * Redirect link configuration for PostTeaser.
 */
export type PostTeaserRedirect = LinkProps & {
  /** Optional label text for the link. */
  label?: string
  /** Optional icon props for the link icon. */
  icon?: IconProps
}

/**
 * Class name overrides for PostTeaser sub-elements.
 */
export type PostTeaserClasses = {
  root?: string
  cardContainer?: string
  card?: string
  header?: string
  imageWrapper?: string
  imageContainer?: string
  image?: string
  meta?: string
  metaCategory?: string
  headline?: string
  cardContent?: string
  content?: string
  cardFooter?: string
  date?: string
  link?: string
  linkIcon?: string
}

/**
 * Per-component prop overrides for PostTeaser.
 */
export type PostTeaserComponentsProps = {
  card?: Partial<CardProps>
  image?: Partial<ImageProps>
  headline?: Partial<HeadlineProps>
  categoryChip?: Partial<ChipProps>
  readCountChip?: Partial<ChipProps>
  linkIcon?: Partial<IconProps>
}

// --- Conditional date/locale ---
/**
 * Post teaser with localized date formatting.
 */
export type PostTeaserWithDate = {
  /** ISO date string. */
  date: string
  /** Locale(s) for date formatting. */
  locale: Intl.LocalesArgument
}

/**
 * Post teaser without date info.
 */
export type PostTeaserWithoutDate = {
  date?: undefined
  locale?: never
}
// --------------------------------

/**
 * Base PostTeaser props.
 * Renders a compact article preview with image and metadata.
 *
 * @example
 * <PostTeaser
 *   title={{ content: "How to scale" }}
 *   content="Short excerpt..."
 *   image={{ src: "/blog/scale.jpg", alt: "Scale" }}
 *   redirect={{ href: "/blog/scale", label: "Read" }}
 * />
 */
export type PostTeaserPropsBase = {
  /** Root class name. */
  className?: string
  /** Class overrides for sub-elements. */
  classes?: PostTeaserClasses
  /** Component-level prop overrides. */
  componentsProps?: PostTeaserComponentsProps

  /** Read count (display only). */
  readCount?: number
  /** Word count for reading time calculation. */
  wordCount?: number
  /** Title/headline config. */
  title: PostTeaserHeadline
  /** Excerpt content text. */
  content?: string
  /** Hide category chip. */
  hideCategory?: boolean
  /** Category label. */
  category?: string
  /** Image props. */
  image?: PostTeaserImage
  /** Click handler on the teaser card. */
  onClick?: () => void
  /** Redirect link props. */
  redirect?: PostTeaserRedirect

  /** Toggle JSON-LD structured data output. */
  structuredData?: boolean
  /** Words per minute for reading time calculation. */
  readingWpm?: number
}

/**
 * Full PostTeaser props, including conditional date/locale.
 */
export type PostTeaserProps = PostTeaserPropsBase &
  (PostTeaserWithDate | PostTeaserWithoutDate)

/**
 * Internal view props for PostTeaser rendering.
 */
export type PostTeaserViewProps = PostTeaserProps & {
  /** Hover state from client. */
  isHovered?: boolean
  /** Derived reading time in minutes. */
  readMinutes: number
  /** Mouse enter handler. */
  onMouseEnter?: () => void
  /** Mouse leave handler. */
  onMouseLeave?: () => void
}
