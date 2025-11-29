import type { LabelProps } from "../label"
import type { Ref, FocusEvent, MouseEvent } from "react"

/* ---------- Events / helpers ---------------------------- */

export type RatingValue = number | string

export type RatingChangeEvent = {
  name: string
  value: RatingValue
}

export type RatingChangeEventHandler = (event: RatingChangeEvent) => void

export type RatingValidateEvent = (name: string, error?: string) => void

export type RatingFocusEvent = FocusEvent<HTMLElement>
export type RatingFocusEventHandler = (event: RatingFocusEvent) => void

export type RatingBlurEvent = RatingFocusEvent
export type RatingBlurEventHandler = (event: RatingBlurEvent) => void

export type RatingErrorTranslations = {
  required?: string
  min?: string
  max?: string
}

/* ---------- Public props -------------------------------- */

export type RatingProps = {
  id?: string
  name: string
  label?: string
  labelProps?: Omit<LabelProps, "label" | "required" | "error" | "htmlFor">

  value?: RatingValue
  defaultValue?: RatingValue

  max?: number
  min?: number

  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  fullWidth?: boolean

  helperText?: string
  errorText?: string
  errorTranslations?: RatingErrorTranslations

  isFocused?: boolean
  className?: string
  fieldClassName?: string
  groupClassName?: string
  iconClassName?: string
  hideLegend?: boolean

  onChange?: RatingChangeEventHandler
  onValidate?: RatingValidateEvent
  onFocus?: RatingFocusEventHandler
  onBlur?: RatingBlurEventHandler

  /** forwarded to hidden input for forms */
  inputRef?: Ref<HTMLInputElement>
}

export type RatingViewProps = RatingProps & {
  hoverValue?: RatingValue
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  onMouseEnter?: (e: MouseEvent<HTMLButtonElement>) => void
  onMouseLeave?: () => void
}
