import type { ButtonProps } from "../button"
import type { HeadlineProps } from "../headline"
import type { ImageProps } from "../image"

export type ImageTextHeadline = {
  content: string
} & Omit<HeadlineProps, "children">

export type ImageTextAnimatedBorder = {
  direction?: "top-to-bottom" | "bottom-to-top"
}

export type ImageTextProps = {
  animatedBorder?: ImageTextAnimatedBorder
  reverse?: boolean
  subTitle?: string
  subTitleProps?: Omit<HeadlineProps, "children">
  title: string
  titleProps?: Omit<HeadlineProps, "children">
  content?: string
  animation?: string
  image?: ImageProps
  button?: ButtonProps
}
