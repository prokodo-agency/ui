import type { InputProps } from "../input"
import type { IconName } from "@/components/icon"
import type { Variants } from "@/types/variants"
import type { Dayjs } from "dayjs"
import type { CSSProperties, TouchEventHandler } from "react"

// -----------------------------------------------------------------
// View mode
// -----------------------------------------------------------------

/** Which picker panel is currently visible inside the dialog. */
export type DatePickerViewMode = "days" | "months" | "years"

/** A single cell in the calendar day grid. */
export interface CalendarDay {
  date: Dayjs
  isCurrentMonth: boolean
  isToday: boolean
  isDisabled: boolean
}

/** Props that manage open / navigation / selection state — owned by client. */
export interface DatePickerDialogBehavior {
  isOpen: boolean
  /** Current picker panel: "days", "months" or "years". */
  viewMode: DatePickerViewMode
  viewingMonth: Dayjs
  selectedDate: Dayjs | null
  onToggle: () => void
  onPrevMonth: () => void
  onNextMonth: () => void
  /** Switch the visible panel. */
  onViewModeChange: (mode: DatePickerViewMode) => void
  /** User picked a month (0-based) in the month-picker panel. */
  onMonthSelect: (month: number) => void
  /** User picked a year in the year-picker panel. */
  onYearSelect: (year: number) => void
  onDayClick: (day: Dayjs) => void
  onToday: () => void
  onClear: () => void
  onApply: () => void
  onTimeChange: (value: number, unit: "hour" | "minute") => void
}

/**
 * Optional UI customization for the calendar dialog.
 * All props are passed through `DatePickerProps` and forwarded to the dialog.
 */
export interface DatePickerDialogCustomization {
  /** Icon name for the "previous month" nav button. Default: "ArrowLeft01Icon". */
  prevIcon?: IconName
  /** Icon name for the "next month" nav button. Default: "ArrowRight01Icon". */
  nextIcon?: IconName
  /** Aria-label for the "previous month" nav button. Default: "Previous month". */
  prevAriaLabel?: string
  /** Aria-label for the "next month" nav button. Default: "Next month". */
  nextAriaLabel?: string
  /** Weekday header labels (7 entries, Mon–Sun). Default: ["Mo","Tu","We","Th","Fr","Sa","Su"]. */
  weekdays?: readonly string[]
  /** Dayjs format string for the month/year header. Default: "MMMM YYYY". */
  monthFormat?: string
  /** Dayjs format string for each day's aria-label. Default: "D MMMM YYYY". */
  dayAriaFormat?: string
  /** Label for the "Today" footer button. Default: "Today". */
  todayLabel?: string
  /** Label for the "Clear" footer button. Default: "Clear". */
  clearLabel?: string
  /** Label for the "Apply" footer button. Default: "Apply". */
  applyLabel?: string
  /** Label for the time row. Default: "Time". */
  timeLabel?: string
  /** Icon name for the mobile close button. Default: "Cancel01Icon". */
  closeIcon?: IconName
  /** Aria-label for the mobile close button. Default: "Close". */
  closeLabel?: string
  /** Visual color variant override for the calendar dialog only. Falls back to the root `color` prop if not set. */
  dialogColor?: Variants
}

/** Full props for the `DatePickerDialog` component. */
export interface DatePickerDialogProps
  extends Omit<DatePickerDialogBehavior, "isOpen" | "onToggle">,
    DatePickerDialogCustomization {
  name: string
  label: string
  withTime?: boolean
  minuteStep?: number
  minDate?: DatePickerValue
  maxDate?: DatePickerValue
  /** Called when the user taps the backdrop or close button (mobile). Typically the same as onToggle. */
  onClose?: () => void
  /** Touch-start handler injected by the client for swipe gestures. */
  onDialogTouchStart?: TouchEventHandler<HTMLDivElement>
  /** Touch-end handler injected by the client for swipe gestures. */
  onDialogTouchEnd?: TouchEventHandler<HTMLDivElement>
  /** Inline style override — used for fixed positioning when portaled on desktop. */
  style?: CSSProperties
}

/** Date/time value: Dayjs object, ISO string, or null (empty). */
export type DatePickerValue = Dayjs | string | null

/**
 * Custom validation error messages for date constraints.
 * Overrides default error messages when validation fails.
 */
export type DatePickerErrorTranslations = {
  /** "This field is required" message when required=true and value is null. */
  required?: string
  /** "Date cannot be before [minDate]" message when value < minDate. */
  minDate?: string
  /** "Date cannot be after [maxDate]" message when value > maxDate. */
  maxDate?: string
}

/**
 * DatePicker component props.\
 * Specialized Input that renders native `<input type="date">` or `<input type="datetime-local">`.\
 * Extends Input props but enforces single-line mode and provides date-specific validation.\
 * Automatically manages Dayjs parsing/formatting with optional time selection.
 *
 * @example
 * // Date-only picker
 * <DatePicker
 *   name="birthDate"
 *   label="Birth Date"
 *   required
 *   minDate="1950-01-01"
 *   maxDate={dayjs()}
 * />
 *
 * @example
 * // DateTime picker with 15-minute steps
 * <DatePicker
 *   name="appointment"
 *   label="Appointment"
 *   withTime
 *   minuteStep={15}
 *   minDate={dayjs()}
 *   onChange={(date) => console.log(date?.format())}
 * />
 */
export interface DatePickerProps
  extends Omit<
    InputProps,
    "onChange" | "value" | "errorTranslations" | "type" | "color"
  > {
  /** Visual color variant — controls gradient and glow. Default: "primary". */
  color?: Variants
  /** Single-line input enforced (date input). Excluded from discriminated union. */
  multiline?: false
  /** Textarea rows not applicable (date input). Excluded from discriminated union. */
  rows?: undefined
  /** Minimum rows not applicable. Excluded from discriminated union. */
  minRows?: undefined
  /** Maximum rows not applicable. Excluded from discriminated union. */
  maxRows?: undefined
  /** Label text (required for a11y and form context). */
  label: string
  /** Unique field name/id (required for form integration and validation tracking). */
  name: string
  /** Mark as required. Shows asterisk in label and enforces non-null validation. */
  required?: boolean
  /** Custom error message from parent form/validator. Overrides auto-generated errors. */
  errorText?: string
  /** Helper/hint text below label (gray, non-error). Useful for format guidance. */
  helperText?: string
  /** Current date value: Dayjs object, ISO string (YYYY-MM-DD), or null (empty). */
  value?: DatePickerValue
  /** Minimum allowed date (inclusive). Validates on change; shows `minDate` error message if violated. */
  minDate?: DatePickerValue
  /** Maximum allowed date (inclusive). Validates on change; shows `maxDate` error message if violated. */
  maxDate?: DatePickerValue
  /** Change callback. Fired when date is selected/cleared. Receives Dayjs object or null. */
  onChange?: (value: DatePickerValue) => void
  /** Custom validation error messages (required, minDate, maxDate). Falls back to defaults if not provided. */
  translations?: DatePickerErrorTranslations
  /**
   * Include time selection in picker.\
   * When `true`: uses `<input type="datetime-local">` and renders time selector (HH:mm).\
   * When `false` (default): uses `<input type="date">` for date-only.\
   * Pair with `minuteStep` to control time granularity.
   */
  withTime?: boolean

  /**
   * Date/time parsing and formatting pattern (dayjs format string).\
   * Defaults: "YYYY-MM-DD" (date-only) or "YYYY-MM-DDTHH:mm" (withTime=true).\
   * Examples: "DD/MM/YYYY", "YYYY-MM-DD HH:mm:ss".\
   * Used for ISO string parsing (`value`) and display formatting.
   */
  format?: string

  /**
   * Time granularity when `withTime=true` (minute-level precision).\
   * Converts to HTML input `step` attribute in seconds (e.g., 15 => 900 seconds).\
   * Limits time selector to multiples (e.g., 15-min steps: 00:00, 00:15, 00:30...).\
   * Default: 1 minute (60 seconds). Ignored when `withTime=false`.
   */
  minuteStep?: number
  /** Icon name for the "previous month" nav button. Default: "ArrowLeft01Icon". */
  prevIcon?: IconName
  /** Icon name for the "next month" nav button. Default: "ArrowRight01Icon". */
  nextIcon?: IconName
  /** Aria-label for the "previous month" nav button. Default: "Previous month". */
  prevAriaLabel?: string
  /** Aria-label for the "next month" nav button. Default: "Next month". */
  nextAriaLabel?: string
  /** Weekday header labels (7 entries, Mon–Sun). Default: ["Mo","Tu","We","Th","Fr","Sa","Su"]. */
  weekdays?: readonly string[]
  /** Dayjs format string for the month/year header. Default: "MMMM YYYY". */
  monthFormat?: string
  /** Dayjs format string for each day's aria-label. Default: "D MMMM YYYY". */
  dayAriaFormat?: string
  /** Label for the "Today" footer button. Default: "Today". */
  todayLabel?: string
  /** Label for the "Clear" footer button. Default: "Clear". */
  clearLabel?: string
  /** Label for the "Apply" footer button. Default: "Apply". */
  applyLabel?: string
  /** Label for the time row. Default: "Time". */
  timeLabel?: string
  /** Icon name for the mobile close button. Default: "Cancel01Icon". */
  closeIcon?: IconName
  /** Aria-label for the mobile close button. Default: "Close". */
  closeLabel?: string
  /** Visual color variant override for the calendar dialog only. Falls back to the root `color` prop if not set. */
  dialogColor?: Variants
}
