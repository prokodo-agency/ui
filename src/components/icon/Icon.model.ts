import type { ICON_MAP } from "./Icon.utils"
import type { Color } from "@/types/colors"
import type { Variants } from "@/types/variants"
import type { AriaAttributes, AriaRole } from "react"

export type IconName = keyof typeof ICON_MAP

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | number

export type IconColor = Color | Variants

export type IconProps = {
  name?: IconName
  color?: IconColor
  size?: IconSize
  className?: string
  role?: AriaRole
  onClick?: () => void
} & AriaAttributes
