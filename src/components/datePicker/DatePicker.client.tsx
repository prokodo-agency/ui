"use client"

import dayjs, { isDayjs, type Dayjs } from "dayjs"
import {
  type FC,
  useState,
  useEffect,
  useCallback,
} from "react"

import { DatePickerView } from "./DatePicker.view"

import type {
  InputChangeEvent
} from "@/components/input"
import type {
  DatePickerProps,
  DatePickerValue,
} from "./DatePicker.model"

function toDayjs(val?: DatePickerValue): Dayjs | null {
  if (!val) return null
  if (isDayjs(val)) return val
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
      if (minDate && d.isBefore(dayjs(minDate), "day")) {
        const msg =
          dayjs(minDate).isSame(dayjs(), "day")
            ? translations?.minDate ||
              "Date cannot be in the past."
            : translations?.minDate ||
              `Date must be ≥ ${dayjs(minDate).format(format)}`
        setError(msg)
        onValidate?.(name, msg)
        onChange?.(null)
        return
      }
      if (maxDate && d.isAfter(dayjs(maxDate), "day")) {
        const msg =
          dayjs(maxDate).isSame(dayjs(), "day")
            ? translations?.maxDate ||
              "Date cannot be in the future."
            : translations?.maxDate ||
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
      name={name}
      label={label}
      helperText={helperText}
      errorText={error}
      value={date}
      format={format}
      minDate={minDate}
      maxDate={maxDate}
      onValidate={onValidate}
      onChange={(value) => emitValue(value)}
    />
  )
}

export default DatePickerClient
