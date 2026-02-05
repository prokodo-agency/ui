import type { IconName } from "./IconList"
import type { Color } from "@/types/colors"
import type { Variants } from "@/types/variants"
import type { AriaAttributes, AriaRole } from "react"

/**
 * Icon size token or explicit pixel size.
 */
export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | number

/**
 * Icon color token (semantic color or variant).
 */
export type IconColor = Color | Variants

/**
 * Icon component props.
 * Renders an SVG/icon asset by name with optional color/size.
 *
 * @example
 * <Icon name="check" color="success" size="md" />
 *
 * @example
 * <Icon name="close" label="Close dialog" role="img" />
 *
 * @a11y Provide `label` for meaningful icons. Decorative icons should omit label.
 */
export type IconProps = {
  /**
   * Short text alternative for assistive tech.
   * - If provided → role="img" and readable by screen readers.
   * - If omitted → aria-hidden for decorative icons.
   */
  label?: string
  /**
   * Icon name key from the icon registry.
   */
  name?: IconName
  /**
   * Icon color token.
   */
  color?: IconColor
  /**
   * Icon size token or explicit pixel size.
   */
  size?: IconSize
  /**
   * Additional CSS classes applied to the icon element.
   */
  className?: string
  /**
   * Explicit ARIA role override.
   */
  role?: AriaRole
  /**
   * Click handler (if interactive).
   */
  onClick?: () => void
} & AriaAttributes
