import type { IconName } from "./icons"
import type { Color } from "@/types/colors"
import type { Variants } from "@/types/variants"
import type { AriaAttributes, AriaRole, SuspenseProps } from "react"

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | number

export type IconColor = Color | Variants

export type IconProps = {
  name?: IconName
  color?: IconColor
  size?: IconSize
  className?: string
  role?: AriaRole
  onClick?: () => void
  suspenseProps?: SuspenseProps
} & AriaAttributes
