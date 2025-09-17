"use client"

import dayjs, { isDayjs, type Dayjs } from "dayjs"
import {
  type FC,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react"

import { isNull } from "@/helpers/validations"

import { DatePickerView } from "./DatePicker.view"

import type {
  DatePickerProps,
  DatePickerValue,
} from "./DatePicker.model"
import type { InputChangeEvent } from "@/components/input"

/** Convert incoming value to Dayjs|null */
function toDayjs(val?: DatePickerValue): Dayjs | null {
  if (isNull(val)) return null
  if (isDayjs(val)) return val
  const d = dayjs(val)
  return d.isValid() ? d : null
}

const DatePickerClient: FC<DatePickerProps> = ({
  name,
  value,
  onChange,
  onValidate,
  format,
  minDate,
  maxDate,
  translations,
  label,
  helperText,
  withTime = false,
  minuteStep = 1,
  ...rest
}) => {
  const [date, setDate] = useState<Dayjs | null>(toDayjs(value))
  const [error, setError] = useState<string | undefined>(undefined)

  // Choose default format depending on withTime (allow custom override)
  const fmt = useMemo(
    () => format ?? (withTime ? "YYYY-MM-DDTHH:mm" : "YYYY-MM-DD"),
    [format, withTime]
  )

  // Comparison unit (day when date-only, minute when datetime)
  const unit = withTime ? "minute" : "day"

  useEffect(() => {
    setDate(toDayjs(value))
    setError(undefined)
    onValidate?.(name, undefined)
  }, [value, name, onValidate])

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

      const d = dayjs(val, fmt, true)
      if (!d.isValid()) {
        const msg = withTime ? "Invalid date/time format." : "Invalid date format."
        setError(msg)
        onValidate?.(name, msg)
        onChange?.(null)
        return
      }

      if (!isNull(minDate) && d.isBefore(dayjs(minDate), unit)) {
        const msg =
          dayjs(minDate).isSame(dayjs(), unit)
            ? (translations?.minDate ??
              (withTime ? "Date/time cannot be in the past." : "Date cannot be in the past."))
            : (translations?.minDate ??
              `Must be ≥ ${dayjs(minDate).format(fmt)}`)
        setError(msg)
        onValidate?.(name, msg)
        onChange?.(null)
        return
      }

      if (!isNull(maxDate) && d.isAfter(dayjs(maxDate), unit)) {
        const msg =
          dayjs(maxDate).isSame(dayjs(), unit)
            ? (translations?.maxDate ??
              (withTime ? "Date/time cannot be in the future." : "Date cannot be in the future."))
            : (translations?.maxDate ??
              `Must be ≤ ${dayjs(maxDate).format(fmt)}`)
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
    [fmt, maxDate, minDate, name, onChange, onValidate, translations, withTime, unit]
  )

  return (
    <DatePickerView
      {...rest}
      errorText={error}
      format={fmt}
      helperText={helperText}
      label={label}
      maxDate={maxDate}
      minDate={minDate}
      minuteStep={minuteStep}
      name={name}
      value={date}
      withTime={withTime}
      onChange={(value) => emitValue(value)}
      onValidate={onValidate}
    />
  )
}

export default DatePickerClient
