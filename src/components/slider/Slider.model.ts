import type { LabelProps } from "../label"
import type { HTMLAttributes, FocusEvent, ChangeEvent } from "react"

/**
 * A labeled mark on the slider track.
 */
export interface SliderMark {
  /** Numeric value for the mark. */
  value: number
  /** Optional label shown at the mark. */
  label?: string
}

/**
 * Slider component props.
 * Renders a single-value range input with optional marks and labels.
 *
 * @example
 * <Slider id="price" label="Price" min={0} max={100} />
 */
export interface SliderProps {
  /** Unique identifier (also used for label htmlFor). */
  id: string

  /** Current value (controlled). */
  value?: number | string

  /** Minimum value (default: 0). */
  min?: number

  /** Maximum value (default: 100). */
  max?: number

  /** Step increment (default: 1). */
  step?: number

  /** Name attribute of the field. */
  name?: string

  /** Custom error message. */
  errorText?: string

  /** Custom helper message. */
  helperText?: string

  /**
   * If true, show tick marks at each step (unstyled; view will position them).
   * Or supply an array of `{ value, label? }` to render custom marks.
   */
  marks?: boolean | SliderMark[]

  /** Label text (renders above the slider). */
  label?: string

  /** Hide label. */
  hideLabel?: boolean

  /** Props forwarded to the Label component. */
  labelProps?: Omit<LabelProps, "htmlFor" | "label" | "required" | "error">

  /** Props forwarded to the floating value tooltip <span>. */
  valueLabelProps?: HTMLAttributes<HTMLSpanElement>

  /** If true, renders *— Required —* on the label. */
  required?: boolean

  /** Disable the slider entirely. */
  disabled?: boolean

  /** Called when slider gains focus. */
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void

  /** Called when slider loses focus. */
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void

  /**
   * Called whenever the value changes.
   * Signature: (e: ChangeEvent<HTMLInputElement>, newValue: number) => void
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, value: number) => void

  /** Optional additional CSS class on the root container. */
  className?: string

  /**
   * How the thumb snaps when the user drags it.
   * - "none": free value (default)
   * - "step": snap to multiples of `step`
   * - "marks": snap to nearest mark value (from `marks` array or implicit step marks)
   */
  snap?: "none" | "step" | "marks"
}

/**
 * Internal view props for Slider rendering.
 */
export interface SliderViewProps extends SliderProps {
  /** Internal controlled numeric value. */
  internalValue: number

  /** Whether the input is currently focused. */
  isFocused: boolean

  /** Focus handler. */
  onFocusInternal: (e: React.FocusEvent<HTMLInputElement>) => void

  /** Blur handler. */
  onBlurInternal: (e: React.FocusEvent<HTMLInputElement>) => void

  /** Change handler. */
  onChangeInternal: (e: ChangeEvent<HTMLInputElement>) => void
}
