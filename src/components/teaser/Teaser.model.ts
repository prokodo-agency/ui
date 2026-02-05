import type { HeadlineProps } from "../headline"
import type { IconProps } from "../icon"
import type { ImageProps } from "../image"
import type { LinkProps } from "../link"
import type { Variants } from "@/types/variants"

/**
 * Visual variant for Teaser.
 */
export type TeaserVariant = Variants

/**
 * Headline content definition for Teaser.
 */
export type TeaserHeadline = {
  /** Headline text content. */
  content: string
} & Omit<HeadlineProps, "children">

/**
 * Image props for teaser media.
 */
export type TeaserImage = ImageProps

/**
 * Redirect link configuration for Teaser.
 */
export type TeaserRedirect = LinkProps & {
  /** Optional label text for the link. */
  label?: string
  /** Optional icon props for the link icon. */
  icon?: IconProps
}

/**
 * Text alignment options.
 */
export type TeaserAlign = "left" | "center" | "right"

/**
 * Teaser component props.
 * Renders a compact content card with image, headline, and optional redirect.
 *
 * @example
 * <Teaser
 *   title={{ content: "New Feature" }}
 *   content="Discover what's new"
 *   image={{ src: "/feature.jpg", alt: "Feature" }}
 * />
 */
export type TeaserProps = {
  /** Root class name. */
  className?: string
  /** Visual variant token. */
  variant?: TeaserVariant
  /** Text alignment. */
  align?: TeaserAlign
  /** Clamp content lines (optional). */
  lineClamp?: boolean
  /** Title/headline config. */
  title: TeaserHeadline
  /** Body content text. */
  content?: string
  /** Image props. */
  image?: TeaserImage
  /** Optional animation name/class. */
  animation?: string
  /** Click handler on the teaser. */
  onClick?: () => void
  /** Redirect link props. */
  redirect?: TeaserRedirect
}
