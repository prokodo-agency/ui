import type { LabelProps } from "../label"
import type { Ref, FocusEvent, MouseEvent } from "react"

/* ---------- Events / helpers ---------------------------- */

/**
 * Rating value type (numeric or string).
 */
export type RatingValue = number | string

/**
 * Change event payload for Rating.
 */
export type RatingChangeEvent = {
  /** Field name. */
  name: string
  /** New rating value. */
  value: RatingValue
}

/** Rating change handler. */
export type RatingChangeEventHandler = (event: RatingChangeEvent) => void

/** Validation callback (name + optional error message). */
export type RatingValidateEvent = (name: string, error?: string) => void

/** Focus event type. */
export type RatingFocusEvent = FocusEvent<HTMLElement>
/** Focus event handler. */
export type RatingFocusEventHandler = (event: RatingFocusEvent) => void

/** Blur event type (same as focus). */
export type RatingBlurEvent = RatingFocusEvent
/** Blur event handler. */
export type RatingBlurEventHandler = (event: RatingBlurEvent) => void

/**
 * Error translation strings for validation states.
 */
export type RatingErrorTranslations = {
  /** Required field error message. */
  required?: string
  /** Minimum value error message. */
  min?: string
  /** Maximum value error message. */
  max?: string
}

/* ---------- Public props -------------------------------- */

/**
 * Rating component props.
 * Renders a selectable rating group (e.g., stars).
 *
 * @example
 * <Rating name="rating" label="Score" max={5} />
 */
export type RatingProps = {
  /** Optional id for the field. */
  id?: string
  /** Field name (required). */
  name: string
  /** Visible label text. */
  label?: string
  /** Label component overrides. */
  labelProps?: Omit<LabelProps, "label" | "required" | "error" | "htmlFor">

  /** Controlled value. */
  value?: RatingValue
  /** Uncontrolled default value. */
  defaultValue?: RatingValue

  /** Maximum selectable value. */
  max?: number
  /** Minimum selectable value. */
  min?: number

  /** Disable user input. */
  disabled?: boolean
  /** Read-only display (no interaction). */
  readOnly?: boolean
  /** Mark field as required. */
  required?: boolean
  /** Stretch to full width of container. */
  fullWidth?: boolean

  /** Helper text displayed below the field. */
  helperText?: string
  /** Error text displayed below the field. */
  errorText?: string
  /** Localized error messages. */
  errorTranslations?: RatingErrorTranslations

  /** Force focused state (for controlled focus). */
  isFocused?: boolean
  /** Root class name. */
  className?: string
  /** Field wrapper class name. */
  fieldClassName?: string
  /** Group wrapper class name. */
  groupClassName?: string
  /** Icon class name. */
  iconClassName?: string
  /** Hide the legend (label) visually. */
  hideLegend?: boolean

  /** Change handler. */
  onChange?: RatingChangeEventHandler
  /** Validation handler. */
  onValidate?: RatingValidateEvent
  /** Focus handler. */
  onFocus?: RatingFocusEventHandler
  /** Blur handler. */
  onBlur?: RatingBlurEventHandler

  /** Forwarded to hidden input for forms. */
  inputRef?: Ref<HTMLInputElement>
}

/**
 * Internal view props for Rating rendering.
 */
export type RatingViewProps = RatingProps & {
  /** Current hover value (for preview). */
  hoverValue?: RatingValue
  /** Click handler for buttons. */
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  /** Mouse enter handler for buttons. */
  onMouseEnter?: (e: MouseEvent<HTMLButtonElement>) => void
  /** Mouse leave handler for buttons. */
  onMouseLeave?: () => void
}
