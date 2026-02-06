import type { ButtonProps } from "../button"
import type { CardProps } from "../card"
import type { HeadlineProps } from "../headline"
import type { ImageProps } from "../image"
import type { LinkProps } from "../link"

/**
 * Headline content definition for PostWidgetCarousel.
 */
export type PostWidgetCarouselHeadline = {
  /** Headline text content. */
  content: string
} & Omit<HeadlineProps, "children">

/** Image props for carousel items. */
export type PostWidgetCarouselImage = ImageProps
/** Link props for carousel item navigation. */
export type PostWidgetCarouselRedirect = LinkProps

/**
 * Carousel item definition.
 */
export type PostWidgetCarouselItem = {
  /** Item headline config. */
  title: PostWidgetCarouselHeadline
  /** Optional item image. */
  image?: PostWidgetCarouselImage
  /** Navigation link. */
  redirect: PostWidgetCarouselRedirect
  /** Optional per-item class hooks. */
  classes?: {
    /** Slide wrapper class. */
    slide?: string
    /** Image link wrapper class. */
    imageLink?: string
    /** Image element class. */
    image?: string
    /** Link element class. */
    link?: string
    /** Headline element class. */
    headline?: string
  }
  /** Optional per-item component prop overrides. */
  componentsProps?: {
    /** Image component overrides. */
    image?: Partial<ImageProps>
    /** Link component overrides. */
    link?: Partial<LinkProps>
    /** Headline component overrides. */
    headline?: Partial<HeadlineProps>
  }
}

/**
 * Class name overrides for PostWidgetCarousel sub-elements.
 */
export type PostWidgetCarouselClasses = {
  /** Root wrapper class. */
  root?: string
  /** Card container wrapper class. */
  cardContainer?: string
  /** Card element class. */
  card?: string
  /** Title element class. */
  title?: string
  /** Carousel root class. */
  carousel?: string
  /** Carousel inner wrapper class. */
  carouselWrapper?: string
  /** Dots container class. */
  carouselDots?: string
  /** Individual carousel item class. */
  carouselItem?: string
  /** Item image link class. */
  carouselItemImageLink?: string
  /** Item image class. */
  carouselItemImage?: string
  /** Item link class. */
  carouselItemLink?: string
  /** Navigation buttons container class. */
  carouselButtons?: string
  /** Navigation button class. */
  carouselButton?: string
}

/**
 * Per-component prop overrides for PostWidgetCarousel.
 */
export type PostWidgetCarouselComponentsProps = {
  /** Card component overrides. */
  card?: Partial<CardProps>
  /** Title headline overrides. */
  title?: Partial<HeadlineProps>
  /** Image component overrides. */
  image?: Partial<ImageProps>
  /** Link component overrides. */
  link?: Partial<LinkProps>
  /** Previous button overrides. */
  prevButton?: Partial<ButtonProps>
  /** Next button overrides. */
  nextButton?: Partial<ButtonProps>
}

/**
 * PostWidgetCarousel props.
 * Renders a carousel of post items inside a card.
 *
 * @example
 * <PostWidgetCarousel
 *   title={{ content: "Featured" }}
 *   autoplay={5000}
 *   items={[{ title: { content: "Post" }, redirect: { href: "/p/1" } }]}
 * />
 */
export type PostWidgetCarouselProps = Omit<CardProps, "children"> & {
  /** Autoplay interval in ms (0/undefined disables). */
  autoplay?: number
  /** Root class name. */
  className?: string
  /** Carousel title headline. */
  title?: PostWidgetCarouselHeadline
  /** Carousel items. */
  items?: PostWidgetCarouselItem[]

  /** Class overrides for sub-elements. */
  classes?: PostWidgetCarouselClasses
  /** Component-level prop overrides. */
  componentsProps?: PostWidgetCarouselComponentsProps
  /** Toggle JSON-LD structured data output. */
  structuredData?: boolean
}
