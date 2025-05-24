"use client"

import dayjs, { type Dayjs, isDayjs } from "dayjs"
import { type FC, type ChangeEvent, useRef, useState, useEffect } from "react"

import { Input } from "../input"

import type { DatePickerProps, DatePickerValue } from "./DatePicker.model"

/**
 * A DatePicker that:
 * 1. Stores the date internally as Dayjs | null (`DatePickerValue`).
 * 2. Calls `onChange` with the validated date (Dayjs or null).
 * 3. Reports errors via `onValidate(name, error)`.
 * 4. Renders the error in the `Input` itself.
 */
export const DatePicker: FC<DatePickerProps> = ({
  name,
  value, // Dayjs | null from parent
  onChange, // (value: Dayjs | null) => void
  onValidate, // (name: string, error?: string) => void
  label,
  errorText,
  helperText,
  format = "YYYY-MM-DD",
  minDate,
  maxDate,
  errorTranslations,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  // Safely convert anything minDate, maxDate to Dayjs or null
  const toDayjs = (val?: DatePickerValue): Dayjs | null => {
    if (!val) return null
    if (isDayjs(val)) return val
    const parsed = dayjs(val)
    return parsed.isValid() ? parsed : null
  }

  const safeMinDate = toDayjs(minDate)
  const safeMaxDate = toDayjs(maxDate)

  // Local state: the currently valid date (Dayjs or null) and any error
  const [date, setDate] = useState<DatePickerValue>(null)
  const [error, setError] = useState<string | undefined>(errorText)

  // Sync local state if parent changes `value`
  useEffect(() => {
    if (!value) {
      setDate(null)
      setError(undefined)
      onValidate?.(name, undefined)
      return
    }

    if (isDayjs(value)) {
      setDate(value)
      setError(undefined)
      onValidate?.(name, undefined)
    } else {
      // If the parent incorrectly passed a string or something
      const parsed = toDayjs(value)
      if (!parsed) {
        const msg = "Invalid initial date."
        setDate(null)
        setError(msg)
        onValidate?.(name, msg)
      } else {
        setDate(parsed)
        setError(undefined)
        onValidate?.(name, undefined)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  /**
   * Validate the parsed date for range checks, etc.
   * Return an error string if invalid/out-of-range, or undefined if good.
   */
  const validateDayjs = (parsed: Dayjs): string | undefined => {
    // minDate check
    if (safeMinDate && parsed.isBefore(safeMinDate, "day")) {
      // If minDate == "today"
      if (safeMinDate.isSame(dayjs(), "day")) {
        return errorTranslations?.minDate ?? "Date cannot be in the past."
      }
      return (
        errorTranslations?.minDate ??
        `Date cannot be before ${safeMinDate.format(format)}.`
      )
    }

    // maxDate check
    if (safeMaxDate && parsed.isAfter(safeMaxDate, "day")) {
      // If maxDate == "today"
      if (safeMaxDate.isSame(dayjs(), "day")) {
        return errorTranslations?.maxDate ?? "Date cannot be in the future."
      }
      return (
        errorTranslations?.maxDate ??
        `Date cannot be after ${safeMaxDate.format(format)}.`
      )
    }

    return undefined
  }

  /**
   * Handle user input changes in the native date field.
   * If valid => update local state, call onChange(dayjsDate), clear error.
   * If invalid => set error, call onValidate(name, error), call onChange(null).
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.trim() // "YYYY-MM-DD"
    if (!inputValue) {
      // User cleared
      setDate(null)
      setError(undefined)
      onValidate?.(name, undefined)
      onChange?.(null)
      return
    }

    // Strict parse
    const parsed = dayjs(inputValue, format, true)
    if (!parsed.isValid()) {
      const msg = "Invalid date format."
      setDate(null)
      setError(msg)
      onValidate?.(name, msg)
      onChange?.(null)
      return
    }

    // Check range
    const rangeError = validateDayjs(parsed)
    if (rangeError !== undefined) {
      setDate(null)
      setError(rangeError)
      onValidate?.(name, rangeError)
      onChange?.(null)
      return
    }

    // All good
    setDate(parsed)
    setError(undefined)
    onValidate?.(name, undefined)
    onChange?.(parsed) // give the parent a valid Dayjs
  }
  return (
    <Input
      {...props}
      ref={inputRef}
      aria-haspopup="dialog"
      errorText={error}
      helperText={helperText}
      id={name}
      label={label}
      maxRows={undefined}
      minRows={undefined}
      multiline={false}
      name={name}
      rows={undefined}
      type="date"
      value={date ? dayjs(date).format("YYYY-MM-DD") : ""}
      onChange={handleChange}
    />
  )
}

DatePicker.displayName = "DatePicker"
