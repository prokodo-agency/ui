import type { ButtonProps } from "../button"
import type { HeadlineProps } from "../headline"
import type { ImageProps } from "../image"

/**
 * Headline content definition for ImageText.
 * Allows passing all Headline props except children.
 */
export type ImageTextHeadline = {
  /** Headline text content. */
  content: string
} & Omit<HeadlineProps, "children">

/**
 * Animated border configuration.
 */
export type ImageTextAnimatedBorder = {
  /** Direction of the animated border flow. */
  direction?: "top-to-bottom" | "bottom-to-top"
}

/**
 * ImageText component props.
 * Renders an image alongside headline + rich content with optional CTA.
 *
 * @example
 * <ImageText
 *   title="Grow faster"
 *   content="Build with our toolkit"
 *   image={{ src: "/hero.jpg", alt: "Hero" }}
 * />
 *
 * @example
 * <ImageText
 *   title="Automation"
 *   subTitle="New"
 *   reverse
 *   button={{ label: "Learn more", href: "/docs" }}
 * />
 */
export type ImageTextProps = {
  /** Animated border configuration (optional). */
  animatedBorder?: ImageTextAnimatedBorder
  /** Reverse layout (image on the right). */
  reverse?: boolean
  /** Subtitle text (small headline). */
  subTitle?: string
  /** Subtitle headline props. */
  subTitleProps?: Omit<HeadlineProps, "children">
  /** Main title text. */
  title: string
  /** Main title headline props. */
  titleProps?: Omit<HeadlineProps, "children">
  /** Main body content text. */
  content?: string
  /** Optional animation name/class for content entry. */
  animation?: string
  /** Image props for the visual. */
  image?: ImageProps
  /** Optional CTA button props. */
  button?: ButtonProps
}
