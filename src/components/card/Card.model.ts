import type { ImageProps } from "../image"
import type { LinkProps } from "../link"
import type { SkeletonProps } from "../skeleton"
import type { Variants } from "@/types/variants"
import type { Ref, ReactNode, KeyboardEvent, ElementType } from "react"

export type CardVariant = Variants

export type CardBackgroundProps = {
  imageComponent: ElementType
  src?: string
  alt?: string
} & Omit<ImageProps, "src" | "alt" | "imageComponent">

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
