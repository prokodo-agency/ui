import type { ButtonProps } from "../button"
import type { CardProps } from "../card"
import type { HeadlineProps } from "../headline"
import type { ImageProps } from "../image"
import type { PostItemAuthorProps } from "./PostItemAuthor.model"

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
}

export type PostItemComponentsProps = {
  card?: Partial<CardProps>
  headline?: Partial<HeadlineProps>
  button?: Partial<ButtonProps>
  image?: Partial<ImageProps>
  author?: Partial<PostItemAuthorProps>
}

// --- Conditional date/locale ---
export type PostItemWithDate = {
  date: string
  locale: Intl.LocalesArgument
}

export type PostItemWithoutDate = {
  date?: undefined
  locale?: never
}
// --------------------------------

// Props visible to users of the component
export type PostItemPropsBase = {
  className?: string
  classes?: PostItemClasses
  componentsProps?: PostItemComponentsProps

  readCount?: number
  title: PostItemHeadline
  author?: PostItemAuthorProps
  category?: string
  content?: string
  metaDate?: string
  image?: string
  button?: ButtonProps
  structuredData?: boolean
  readingWpm?: number
  animate?: boolean
}

export type PostItemProps = PostItemPropsBase &
  (PostItemWithDate | PostItemWithoutDate)

// Private props only used between Server/Client/View
export type PostItemViewPrivateProps = {
  wordCount: number
  readMinutes: number
}
