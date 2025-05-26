import type { IconName } from "./Icon-list"
import type { Color } from "@/types/colors"
import type { Variants } from "@/types/variants"
import type { AriaAttributes, AriaRole } from "react"

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | number

export type IconColor = Color | Variants

export type IconProps = {
  /**
   * Short text alternative for assistive tech.
   * – If provided  → <img alt="..." role="img">
   * – If omitted   → <img alt=""  role="presentation" aria-hidden="true">
   */
  label?: string
  name?: IconName
  color?: IconColor
  size?: IconSize
  className?: string
  role?: AriaRole
  onClick?: () => void
} & AriaAttributes
