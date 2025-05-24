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
}

export type PostWidgetProps = Omit<CardProps, "children"> & {
  fullWidth?: boolean
  className?: string
  title?: PostWidgetHeadline
  listClassName?: string
  items?: PostWidgetItem[]
}
