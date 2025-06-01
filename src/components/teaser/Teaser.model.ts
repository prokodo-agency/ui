import type { HeadlineProps } from "../headline"
import type { IconProps } from "../icon"
import type { ImageProps } from "../image"
import type { LinkProps } from "../link"
import type { Variants } from "@/types/variants"

export type TeaserVariant = Variants

export type TeaserHeadline = {
  content: string
} & Omit<HeadlineProps, "children">

export type TeaserImage = ImageProps

export type TeaserRedirect = LinkProps & {
  label?: string
  icon?: IconProps
}

export type TeaserAlign = "left" | "center" | "right"

export type TeaserProps = {
  className?: string
  variant?: TeaserVariant
  align?: TeaserAlign
  lineClamp?: boolean
  title: TeaserHeadline
  content?: string
  image?: TeaserImage
  animation?: string
  onClick?: () => void
  redirect?: TeaserRedirect
}
