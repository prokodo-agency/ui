import type { CardProps } from "../card"
import type { ChipProps } from "../chip"
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

export type PostTeaserComponentsProps = {
  card?: Partial<CardProps>
  image?: Partial<ImageProps>
  headline?: Partial<HeadlineProps>
  categoryChip?: Partial<ChipProps>
  readCountChip?: Partial<ChipProps>
  linkIcon?: Partial<IconProps>
}

export type PostTeaserProps = {
  className?: string
  classes?: PostTeaserClasses
  componentsProps?: PostTeaserComponentsProps

  readCount?: number
  title: PostTeaserHeadline
  content?: string
  hideCategory?: boolean
  category?: string
  date?: string // human-readable
  metaDate?: string // ISO 8601
  image?: PostTeaserImage
  onClick?: () => void
  redirect?: PostTeaserRedirect

  // AIC extras
  structuredData?: boolean // default true
  readingWpm?: number // default 200; used for readMinutes
}

export type PostTeaserViewPrivateProps = {
  isHovered?: boolean
  wordCount: number
  readMinutes: number
}
