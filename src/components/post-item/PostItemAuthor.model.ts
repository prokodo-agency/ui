import type { AvatarProps } from "../avatar"
import type { ImageProps } from "../image"
import type { HTMLAttributes } from "react"

export type PostItemAuthorAvatar = Omit<ImageProps, "src" | "alt"> & {
  src?: string
  alt?: string
}

export type PostItemAuthorProps = {
  className?: string
  avatar?: PostItemAuthorAvatar
  avatarProps?: AvatarProps
  name?: string
  nameProps?: HTMLAttributes<HTMLParagraphElement>
}
