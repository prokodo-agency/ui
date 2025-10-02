import type { ButtonProps } from "../button"
import type { HeadlineProps } from "../headline"
import type { ImageProps } from "../image"
import type { PostItemAuthorProps } from "./PostItemAuthor.model"
import type { ComponentType } from "react"

export type PostItemHeadline = {
  content: string
} & Omit<HeadlineProps, "children">

// Props visible to users of the component
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
