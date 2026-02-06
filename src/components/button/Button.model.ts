import type { IconProps } from "../icon"
import type { ImageProps } from "../image"
import type { LinkProps } from "../link"
import type { Ref, ButtonHTMLAttributes, ComponentType, ReactNode } from "react"

/**
 * Ref to the underlying HTMLButtonElement.
 */
export type ButtonRef = Ref<HTMLButtonElement>

/**
 * Visual color variant for the button.
 * Maps to semantic color tokens.
 */
export type ButtonColor =
  | "inherit"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning"

/**
 * Base button properties (without title handling).
 * Shared by all button variants.
 */
export type ButtonProperties = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "color"
> & {
  /** Ref to button element. */
  ref?: ButtonRef
  /** Emphasize button (higher visual priority). */
  priority?: boolean
  /** Color variant (semantic color or inherit). */
  color?: ButtonColor
  /** Stretch button to full parent width. */
  fullWidth?: boolean
  /** CSS class on button content wrapper. */
  contentClassName?: string
  /** Show loading spinner (disables interaction). */
  loading?: boolean
  /** Convert button into a link (SSR-safe). */
  redirect?: LinkProps
  /** Disable interaction. */
  disabled?: boolean
  /** Background image (alternative to icon). */
  image?: ImageProps
  /** Visual style variant. */
  variant?: "contained" | "outlined" | "text"
}

/**
 * Default button variant with text content.
 * Use for labeled buttons with optional icon.
 *
 * @example
 * ```tsx
 * <Button
 *   title="Click Me"
 *   color="primary"
 *   variant="contained"
 *   onClick={handleClick}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With icon
 * <Button
 *   title="Delete"
 *   iconProps={{ name: "trash", color: "error" }}
 * />
 * ```
 */
export type ButtonDefaultProps = Omit<ButtonProperties, "title"> & {
  /** Button label text (used as fallback aria-label). */
  title: string
  /** Icon to display left/right of text. */
  iconProps?: IconProps
  /** Override aria-label (defaults to title). */
  "aria-label"?: string
}

/**
 * Icon-only button variant.
 * Use for buttons with icon only (no text).
 * Must have either aria-label or inert prop for a11y.
 *
 * @example
 * ```tsx
 * // With aria-label
 * <Button
 *   iconProps={{ name: "close" }}
 *   aria-label="Close dialog"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Inert (decorative)
 * <Button
 *   iconProps={{ name: "spinner" }}
 *   inert
 * />
 * ```
 *
 * @a11y Requires aria-label for interactive buttons, or inert=true for decorative icons.
 */
export type ButtonIconProps =
  | (Omit<ButtonProperties, "title" | "aria-label" | "image"> & {
      iconProps: IconProps
      /** Accessible label for screen readers. */
      "aria-label": string
    })
  | (Omit<ButtonProperties, "title" | "aria-label" | "image"> & {
      iconProps: IconProps
      /** Mark as decorative (no a11y label needed). */
      inert: boolean
    })

/**
 * Union type for button variants.
 * Type narrowing based on presence of title/iconProps.
 */
export type ButtonProps = ButtonIconProps | ButtonDefaultProps

/**
 * Internal view component props with computed state.
 * Used by Button.view (not part of public API).
 */
export type ButtonViewProps = ButtonProps & {
  /** Computed: true if button has icon only (no text). */
  isIconOnly: boolean
  /** Background image config. */
  image?: ImageProps
  /** Custom link component for redirect buttons. */
  LinkComponent: ComponentType<{
    href: string
    className: string
    disabled?: boolean
    id?: string
    children: ReactNode
  }>
  /** Ref passed to underlying element. */
  buttonRef?: ButtonRef
}
