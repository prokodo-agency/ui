import type { AvatarProps } from "../avatar"

export type PostItemAuthorProps = {
  className?: string
  avatar?: { src?: string; alt?: string }
  avatarProps?: AvatarProps
  name?: string
  nameProps?: React.HTMLAttributes<HTMLParagraphElement>
}
