import type { CardProps } from "../card"
import type { HeadlineProps } from "../headline"
import type { ImageProps } from "../image"
import type { LinkProps } from "../link"
import type { TimeHTMLAttributes } from "react"

/**
 * Headline content definition for PostWidget.
 */
export type PostWidgetHeadline = {
  /** Headline text content. */
  content: string
} & Omit<HeadlineProps, "children">

/** Image props for item thumbnail. */
export type PostWidgetImage = ImageProps
/** Link props for item navigation. */
export type PostWidgetRedirect = LinkProps

/**
 * Default item configuration for PostWidget.
 */
export type PostWidgetItemDefault = {
  /** Item headline config. */
  title: PostWidgetHeadline
  /** Category label. */
  category?: string
  /** Optional item image. */
  image?: PostWidgetImage
  /** Navigation link. */
  redirect: PostWidgetRedirect
  /** Optional per-item class hooks. */
  classes?: {
    /** List item wrapper class. */
    li?: string
    /** Article container class. */
    article?: string
    /** Header area class. */
    header?: string
    /** Content wrapper class. */
    content?: string
    /** Link wrapper around image class. */
    imageLink?: string
    /** Image element class. */
    image?: string
    /** Headline element class. */
    headline?: string
    /** Date element class. */
    date?: string
  }
  /** Optional per-item component prop overrides. */
  componentsProps?: {
    /** Image component overrides. */
    image?: Partial<ImageProps>
    /** Headline component overrides. */
    headline?: Partial<HeadlineProps>
    /** Link component overrides. */
    link?: Partial<LinkProps>
  }
}

// dateProps stays optional always
/**
 * Optional HTML attributes for the date element.
 */
export type PostWidgetItemDateProps = {
  /** HTML attributes for the <time> element. */
  dateProps?: TimeHTMLAttributes<HTMLTimeElement>
}

// No date -> locale forbidden
/**
 * Item without date info.
 */
export type PostWidgetItemWithoutDate = PostWidgetItemDateProps & {
  date?: undefined
  locale?: never
}

// With date -> locale required
/**
 * Item with localized date formatting.
 */
export type PostWidgetItemWithDate = PostWidgetItemDateProps & {
  /** ISO date string. */
  date: string
  /** Locale(s) for date formatting. */
  locale: Intl.LocalesArgument
}

/**
 * Union of PostWidget item definitions.
 */
export type PostWidgetItem = PostWidgetItemDefault &
  (PostWidgetItemWithoutDate | PostWidgetItemWithDate)

/**
 * Class name overrides for PostWidget sub-elements.
 */
export type PostWidgetClasses = {
  /** Root wrapper class. */
  root?: string
  /** Card container wrapper class. */
  cardContainer?: string
  /** Card element class. */
  card?: string
  /** Widget title class. */
  title?: string
  /** List container class. */
  list?: string
  /** List item class. */
  listItem?: string
  /** List item content wrapper class. */
  listItemContent?: string
  /** Image link wrapper class. */
  imageLink?: string
  /** Image container class. */
  imageContainer?: string
  /** Image element class. */
  image?: string
  /** Content wrapper class. */
  content?: string
  /** Headline class. */
  headline?: string
  /** Date class. */
  date?: string
}

/**
 * Per-component prop overrides for PostWidget.
 */
export type PostWidgetComponentsProps = {
  /** Card component overrides. */
  card?: Partial<CardProps>
  /** Title headline overrides. */
  title?: Partial<HeadlineProps>
  /** Image component overrides. */
  image?: Partial<ImageProps>
  /** Link component overrides. */
  link?: Partial<LinkProps>
}

/**
 * PostWidget props.
 * Renders a list of posts within a card container.
 *
 * @example
 * <PostWidget
 *   title={{ content: "Latest" }}
 *   items={[{ title: { content: "Post" }, redirect: { href: "/p/1" } }]}
 * />
 */
export type PostWidgetProps = Omit<CardProps, "children"> & {
  /** Stretch card to full width of container. */
  fullWidth?: boolean
  /** Root class name. */
  className?: string
  /** Widget headline. */
  title?: PostWidgetHeadline
  /** Legacy list class name (backward compat). */
  listClassName?: string
  /** Legacy content class name (backward compat). */
  contentClassName?: string
  /** Item list. */
  items?: PostWidgetItem[]

  /** Class overrides for sub-elements. */
  classes?: PostWidgetClasses
  /** Component-level prop overrides. */
  componentsProps?: PostWidgetComponentsProps

  /** Toggle JSON-LD structured data output. */
  structuredData?: boolean
}
