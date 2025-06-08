"use client"

import dayjs, { isDayjs, type Dayjs } from "dayjs"
import {
  type FC,
  useState,
  useEffect,
  useCallback,
} from "react"

import { isNull } from "@/helpers/validations"

import { DatePickerView } from "./DatePicker.view"

import type {
  DatePickerProps,
  DatePickerValue,
} from "./DatePicker.model"
import type {
  InputChangeEvent
} from "@/components/input"

/**
 * Convert a DatePickerValue (string | Dayjs | null | undefined)
 * into either a Dayjs (if valid) or null (if empty/invalid).
 */
function toDayjs(val?: DatePickerValue): Dayjs | null {
  // If val is null or undefined → no date selected
  if (isNull(val)) {
    return null
  }
  // If val is already a Dayjs → use it directly
  if (isDayjs(val)) {
    return val
  }
  // Otherwise try parsing the string
  const d = dayjs(val)
  return d.isValid() ? d : null
}

const DatePickerClient: FC<DatePickerProps> = ({
  name,
  value,
  onChange,
  onValidate,
  format = "YYYY-MM-DD",
  minDate,
  maxDate,
  translations,
  label,
  helperText,
  ...rest
}) => {
  const [date, setDate] = useState<Dayjs | null>(toDayjs(value))
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    setDate(toDayjs(value))
    setError(undefined)
    onValidate?.(name, undefined)
  }, [value, name, onValidate])

  // validate date value and call your logical onChange(DatePickerValue)
  const emitValue = useCallback(
    (e: InputChangeEvent) => {
      const val = e?.target?.value
      if (!val) {
        setDate(null)
        setError(undefined)
        onValidate?.(name, undefined)
        onChange?.(null)
        return
      }
      const d = dayjs(val, format, true)
      if (!d.isValid()) {
        const msg = "Invalid date format."
        setError(msg)
        onValidate?.(name, msg)
        onChange?.(null)
        return
      }
      if (!isNull(minDate) && d.isBefore(dayjs(minDate), "day")) {
        const msg =
          dayjs(minDate).isSame(dayjs(), "day")
            ? translations?.minDate ??
              "Date cannot be in the past."
            : translations?.minDate ??
              `Date must be ≥ ${dayjs(minDate).format(format)}`
        setError(msg)
        onValidate?.(name, msg)
        onChange?.(null)
        return
      }
      if (!isNull(maxDate) && d.isAfter(dayjs(maxDate), "day")) {
        const msg =
          dayjs(maxDate).isSame(dayjs(), "day")
            ? translations?.maxDate ??
              "Date cannot be in the future."
            : translations?.maxDate ??
              `Date must be ≤ ${dayjs(maxDate).format(format)}`
        setError(msg)
        onValidate?.(name, msg)
        onChange?.(null)
        return
      }
      setDate(d)
      setError(undefined)
      onValidate?.(name, undefined)
      onChange?.(d)
    },
    [format, maxDate, minDate, name, onChange, onValidate, translations]
  )

  return (
    <DatePickerView
      {...rest}
      errorText={error}
      format={format}
      helperText={helperText}
      label={label}
      maxDate={maxDate}
      minDate={minDate}
      name={name}
      value={date}
      onChange={(value) => emitValue(value)}
      onValidate={onValidate}
    />
  )
}

export default DatePickerClient
