import type { ButtonProps } from "../button"
import type { CardProps } from "../card"
import type { HeadlineProps } from "../headline"
import type { ImageProps } from "../image"
import type { LinkProps } from "../link"

export type PostWidgetCarouselHeadline = {
  content: string
} & Omit<HeadlineProps, "children">

export type PostWidgetCarouselImage = ImageProps
export type PostWidgetCarouselRedirect = LinkProps

export type PostWidgetCarouselItem = {
  title: PostWidgetCarouselHeadline
  image?: PostWidgetCarouselImage
  redirect: PostWidgetCarouselRedirect
  classes?: {
    slide?: string
    imageLink?: string
    image?: string
    link?: string
    headline?: string
  }
  componentsProps?: {
    image?: Partial<ImageProps>
    link?: Partial<LinkProps>
    headline?: Partial<HeadlineProps>
  }
}

export type PostWidgetCarouselClasses = {
  root?: string
  cardContainer?: string
  card?: string
  title?: string
  carousel?: string
  carouselWrapper?: string
  carouselDots?: string
  carouselItem?: string
  carouselItemImageLink?: string
  carouselItemImage?: string
  carouselItemLink?: string
  carouselButtons?: string
  carouselButton?: string
}

export type PostWidgetCarouselComponentsProps = {
  card?: Partial<CardProps>
  title?: Partial<HeadlineProps>
  image?: Partial<ImageProps>
  link?: Partial<LinkProps>
  prevButton?: Partial<ButtonProps>
  nextButton?: Partial<ButtonProps>
}

export type PostWidgetCarouselProps = Omit<CardProps, "children"> & {
  autoplay?: number
  className?: string
  title?: PostWidgetCarouselHeadline
  items?: PostWidgetCarouselItem[]

  classes?: PostWidgetCarouselClasses
  componentsProps?: PostWidgetCarouselComponentsProps
  structuredData?: boolean
}
