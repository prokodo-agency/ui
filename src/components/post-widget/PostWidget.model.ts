import type { CardProps } from "../card"
import type { HeadlineProps } from "../headline"
import type { ImageProps } from "../image"
import type { LinkProps } from "../link"
import type { TimeHTMLAttributes } from "react"

export type PostWidgetHeadline = {
  content: string
} & Omit<HeadlineProps, "children">

export type PostWidgetImage = ImageProps
export type PostWidgetRedirect = LinkProps

export type PostWidgetItem = {
  title: PostWidgetHeadline
  category?: string
  date?: string
  dateProps?: TimeHTMLAttributes<HTMLTimeElement>
  image?: PostWidgetImage
  redirect: PostWidgetRedirect
  // optional per-item class hooks
  classes?: {
    li?: string
    article?: string
    header?: string
    content?: string
    imageLink?: string
    image?: string
    headline?: string
    date?: string
  }
  // optional per-item component prop overrides
  componentsProps?: {
    image?: Partial<ImageProps>
    headline?: Partial<HeadlineProps>
    link?: Partial<LinkProps>
  }
}

export type PostWidgetClasses = {
  root?: string
  cardContainer?: string
  card?: string
  title?: string
  list?: string
  listItem?: string
  listItemContent?: string
  imageLink?: string
  imageContainer?: string
  image?: string
  content?: string
  headline?: string
  date?: string
}

export type PostWidgetComponentsProps = {
  card?: Partial<CardProps>
  title?: Partial<HeadlineProps>
  image?: Partial<ImageProps>
  link?: Partial<LinkProps>
}

export type PostWidgetProps = Omit<CardProps, "children"> & {
  fullWidth?: boolean
  className?: string
  title?: PostWidgetHeadline
  listClassName?: string // backward compat
  contentClassName?: string // backward compat
  items?: PostWidgetItem[]

  classes?: PostWidgetClasses
  componentsProps?: PostWidgetComponentsProps

  structuredData?: boolean
}
