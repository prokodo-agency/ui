import type { AnimatedTextProps } from "@/components/animatedText"
import type { LinkProps } from "@/components/link"
import type { Schema } from "@/types/schema"
import type { Variants } from "@/types/variants"
import type { Options } from "react-markdown"

export type RichTextProps = Options & {
  animated?: boolean
  schema?: Schema
  animationProps?: Omit<AnimatedTextProps, "children">
  variant?: Variants
  itemProp?: string
  linkComponent?: LinkProps["linkComponent"]
}
