import type { ComponentType } from "react"
import type { ButtonProps } from "../button"
import type { HeadlineProps } from "../headline"
import type { ImageProps } from "../image"
import type { PostItemAuthorProps } from "./PostItemAuthor.model"

export type PostItemHeadline = {
  content: string
} & Omit<HeadlineProps, "children">

export type PostItemProps = {
  readCount?: number
  title: PostItemHeadline
  className?: string
  author?: PostItemAuthorProps
  category?: string
  content?: string
  date?: string
  metaDate?: string
  image?: ImageProps
  button?: ButtonProps
  imageComponent?: ComponentType<ImageProps>
}
