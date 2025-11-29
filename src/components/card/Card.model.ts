import type { AnimatedProps } from "../animated"
import type { ImageProps } from "../image"
import type { LinkProps } from "../link"
import type { SkeletonProps } from "../skeleton"
import type { Variants } from "@/types/variants"
import type { StaticImageData } from "next/image"
import type { Ref, ReactNode, KeyboardEvent } from "react"

export type CardVariant = Variants

export type CardBackgroundProps = {
  src?: string | StaticImageData
  alt?: string
} & Omit<ImageProps, "src" | "alt" | "width" | "height">

export type CardProps = {
  ref?: Ref<HTMLDivElement>
  variant?: CardVariant
  loading?: boolean
  skeletonProps?: SkeletonProps
  highlight?: boolean
  gradiant?: boolean
  gradiantClassName?: string
  enableShadow?: boolean
  animated?: boolean
  animatedProps?: AnimatedProps
  customAnimation?: "bottom-top" | "top-bottom" | "left-right" | "right-left"
  className?: string
  contentClassName?: string
  background?: string
  backgroundProps?: CardBackgroundProps
  disabled?: boolean
  redirect?: LinkProps
  onClick?: () => void
  onKeyDown?: (e: KeyboardEvent) => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  children: ReactNode
}
