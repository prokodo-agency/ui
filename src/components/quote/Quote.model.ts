import type { AvatarProps } from "../avatar"
import type { HeadlineProps } from "../headline"
import type { Variants } from "@/types/variants"

export type QuoteHeadline = {
  content: string
} & Omit<HeadlineProps, "children">

export type QuoteAuthor = {
  avatar?: AvatarProps
  name: string
  position?: string
}

export type QuoteProps = {
  className?: string
  variant?: Variants
  title?: QuoteHeadline
  subTitle?: QuoteHeadline
  content: string
  author?: QuoteAuthor
}
