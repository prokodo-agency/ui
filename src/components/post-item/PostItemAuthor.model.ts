import type { AvatarProps } from "../avatar"

/**
 * Author information block props for PostItem.
 */
export type PostItemAuthorProps = {
  /** Root class name for the author block. */
  className?: string
  /** Inline avatar data (src/alt). */
  avatar?: { src?: string; alt?: string }
  /** Avatar component props override. */
  avatarProps?: AvatarProps
  /** Author display name. */
  name?: string
  /** HTML attributes for the author name element. */
  nameProps?: React.HTMLAttributes<HTMLParagraphElement>
}
