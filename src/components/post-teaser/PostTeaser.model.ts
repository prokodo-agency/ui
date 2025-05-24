import type { HeadlineProps } from "../headline"
import type { IconProps } from "../icon"
import type { ImageProps } from "../image"
import type { LinkProps } from "../link"

export type PostTeaserHeadline = {
  content: string
} & Omit<HeadlineProps, "children">

export type PostTeaserImage = ImageProps

export type PostTeaserRedirect = LinkProps & {
  label?: string
  icon?: IconProps
}

export type PostTeaserProps = {
  className?: string
  readCount?: number
  title: PostTeaserHeadline
  content?: string
  hideCategory?: boolean
  category?: string
  date?: string
  metaDate?: string
  image?: PostTeaserImage
  onClick?: () => void
  redirect?: PostTeaserRedirect
}
