import type { AnimatedTextProps } from "@/components/animatedText"
import type { Schema } from "@/types/schema"
import type { Variants } from "@/types/variants"
import type { ReactNode, HTMLProps } from "react"

export type HeadlineTypeProps = "h1" | "h2" | "h3" | "h4" | "h5" | "h6"

export type HeadlineSizeProps = "xxl" | "xl" | "lg" | "md" | "sm" | "xs"

export type HeadlineVariant = Variants

export type HeadlineProps = Omit<HTMLProps<HTMLHeadingElement>, "size"> & {
  animated?: boolean
  animationProps?: Omit<AnimatedTextProps, "children">
  type?: HeadlineTypeProps
  size?: HeadlineSizeProps | number
  highlight?: boolean
  schema?: Schema
  align?: "left" | "center" | "right"
  variant?: HeadlineVariant
  isRichtext?: boolean
  children: ReactNode
}
