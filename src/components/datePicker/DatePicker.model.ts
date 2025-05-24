import type { InputProps } from "../input"
import type { Dayjs } from "dayjs"

// The date value in our component can be a Dayjs instance or `null`.
export type DatePickerValue = Dayjs | null

export type DatePickerErrorTranslations = {
  required?: string
  minDate?: string
  maxDate?: string
}

// Extend the native InputProps with our custom DatePicker props
export interface DatePickerProps
  extends Omit<InputProps, "onChange" | "value" | "errorTranslations"> {
  /**
   * Label text displayed above the date input
   */
  label: string

  /**
   * The unique name/id for the date input
   */
  name: string

  /**
   * Mark this date field as required
   */
  required?: boolean

  /**
   * Any current error text to display under the field (e.g. from form validation)
   */
  errorText?: string

  /**
   * Helper or hint text to display under the field
   */
  helperText?: string

  /**
   * The current date value (Dayjs or null)
   */
  value?: DatePickerValue

  /**
   * Minimum allowed date (Dayjs or null)
   * - Passed to the <input> as `min`, plus validated in handleChange
   */
  minDate?: DatePickerValue

  /**
   * Maximum allowed date (Dayjs or null)
   * - Passed to the <input> as `max`, plus validated in handleChange
   */
  maxDate?: DatePickerValue

  /**
   * Callback fired when a new date is selected or typed
   */
  onChange?: (value: DatePickerValue) => void

  errorTranslations?: DatePickerErrorTranslations

  /**
   * The date format used for Dayjs strict parsing
   * Defaults to 'YYYY-MM-DD' for alignment with the <input type="date"> value.
   */
  format?: string
}
