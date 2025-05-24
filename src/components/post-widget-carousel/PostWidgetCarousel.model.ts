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
}

export type PostWidgetCarouselProps = Omit<CardProps, "children"> & {
  autoplay?: number
  className?: string
  title?: PostWidgetCarouselHeadline
  items?: PostWidgetCarouselItem[]
}
