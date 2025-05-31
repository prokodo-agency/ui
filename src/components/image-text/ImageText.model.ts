import type { ButtonProps } from "../button"
import type { HeadlineProps } from "../headline"
import type { ImageProps } from "../image"
import type { LottieAnimation } from "../lottie"

export type ImageTextHeadline = {
  content: string
} & Omit<HeadlineProps, "children">

export type ImageTextAnimation = LottieAnimation

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
  animation?: ImageTextAnimation
  image?: ImageProps
  button?: ButtonProps
}
