import type { LabelHTMLAttributes, HTMLAttributes } from "react"

/**
 * Base label properties shared by both element and legend types.
 * Use for rendering labels with optional error/required indicators.
 */
export type LabelDefaultrops = {
  /** Mark field as required (displays asterisk). */
  required?: boolean
  /** Show error styling and mark as invalid. */
  error?: boolean
  /** Label text content. */
  label?: string
  /** Props forwarded to the content wrapper span. */
  contentProps?: HTMLAttributes<HTMLSpanElement>
  /** Props forwarded to the text element. */
  textProps?: HTMLAttributes<HTMLElement>
}

/**
 * Legend label variant for use in fieldsets.
 * Inherits from legend attributes and adds label-specific features.
 *
 * @example
 * ```tsx
 * <Label type="legend" label="Select one:" required />
 * ```
 */
export type LabelLegendProps = HTMLAttributes<HTMLLegendElement> & {
  /** Render as <legend> (for form groups/fieldsets). Default: "label". */
  type?: "legend"
} & LabelDefaultrops

/**
 * Standard label element variant for form inputs.
 * Use with htmlFor to associate with form controls.
 *
 * @example
 * ```tsx
 * <Label htmlFor="email" label="Email Address" required error={hasError} />
 * ```
 *
 * @a11y Associates label with input via htmlFor attribute for screen readers.
 * @ssr Safe to render; no hydration issues.
 */
export type LabelElementProps = Omit<
  LabelHTMLAttributes<HTMLLegendElement>,
  "htmlFor"
> & {
  /** Render as <label> (default). */
  type?: "label"
  /** HTML id of the associated form control. */
  htmlFor?: string
} & LabelDefaultrops

/**
 * Union type for either a label or legend variant.
 * Automatically handles different element types and behaviors.
 */
export type LabelProps = LabelElementProps | LabelLegendProps
