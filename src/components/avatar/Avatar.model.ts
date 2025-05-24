import type { ImageProps } from "../image"
import type { LinkProps } from "../link"
import type { Variants } from "@/types/variants"
import type { HTMLAttributes } from "react"

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl"

export type AvatarProps = {
  variant?: Variants
  size?: AvatarSize
  image?: ImageProps
  redirect?: LinkProps
} & HTMLAttributes<HTMLDivElement>
