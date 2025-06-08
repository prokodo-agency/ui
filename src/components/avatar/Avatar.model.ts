import type { ImageProps } from "../image"
import type { LinkProps } from "../link"
import type { Variants } from "@/types/variants"
import type { ReactNode, HTMLAttributes } from "react"

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl"

export type AvatarProps = {
  priority?: boolean
  variant?: Variants
  size?: AvatarSize
  image?: ImageProps
  redirect?: LinkProps
  iconOverride?: ReactNode
} & HTMLAttributes<HTMLDivElement>
