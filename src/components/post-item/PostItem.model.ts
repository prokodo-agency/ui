import type { ButtonProps } from "../button"
import type { CardProps } from "../card"
import type { HeadlineProps } from "../headline"
import type { ImageProps } from "../image"
import type { PostItemAuthorProps } from "./PostItemAuthor.model"
import type { ComponentType } from "react"

export type PostItemHeadline = {
  content: string
} & Omit<HeadlineProps, "children">

export type PostItemClasses = {
  root?: string
  grid?: string
  main?: string
  media?: string
  animation?: string
  headline?: string
  info?: string
  date?: string
  readingTime?: string
  readCount?: string
  contentParagraph?: string
  button?: string
  buttonContent?: string
  imageWrapper?: string
  imageContentWrapper?: string
  image?: string
}

export type PostItemComponentsProps = {
  card?: Partial<CardProps>
  headline?: Partial<HeadlineProps>
  button?: Partial<ButtonProps>
  image?: Partial<ImageProps>
  author?: Partial<PostItemAuthorProps>
}

// Props visible to users of the component
export type PostItemProps = {
  className?: string
  classes?: PostItemClasses
  componentsProps?: PostItemComponentsProps

  readCount?: number
  title: PostItemHeadline
  author?: PostItemAuthorProps
  category?: string
  content?: string
  date?: string
  metaDate?: string
  image?: ImageProps
  button?: ButtonProps
  imageComponent?: ComponentType<ImageProps>
  structuredData?: boolean
  readingWpm?: number
  animate?: boolean
}

// Private props only used between Server/Client/View
export type PostItemViewPrivateProps = {
  isClient?: boolean
  hasImage?: boolean
  imageLoaded?: boolean
  onImageLoad?: () => void
  wordCount: number
  readMinutes: number
  ImageComponent?: ComponentType<ImageProps>
}
