"use client"

import dayjs, { isDayjs, type Dayjs } from "dayjs"
import { useState, useEffect, useMemo, useCallback, type FC } from "react"

import { isString, isNull } from "@/helpers/validations"

import { DatePickerView } from "./DatePicker.view"

import type { DatePickerProps, DatePickerValue } from "./DatePicker.model"

function toDayjs(val?: DatePickerValue): Dayjs | null {
  if (isNull(val)) return null
  if (isDayjs(val)) return val.isValid() ? val : null
  const d = dayjs(val)
  return d.isValid() ? d : null
}
const sameByUnit = (
  a: Dayjs | null,
  b: Dayjs | null,
  unit: "day" | "minute",
) =>
  a === null && b === null
    ? true
    : a !== null && b !== null && a.isSame(b, unit)

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
  const unit = withTime ? "minute" : "day"
  const fmt = useMemo(
    () => format ?? (withTime ? "YYYY-MM-DDTHH:mm" : "YYYY-MM-DD"),
    [format, withTime],
  )

  const [date, setDate] = useState<Dayjs | null>(toDayjs(value))
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    const incoming = toDayjs(value)
    if (!sameByUnit(date, incoming, unit)) {
      setDate(incoming)
      if (incoming) setError(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, unit])

  const emitRaw = useCallback(
    (raw: string) => {
      if (raw === "") {
        if (date !== null) setDate(null)
        if (isString(error)) setError(undefined)
        onValidate?.(name, undefined)
        onChange?.(null)
        return
      }

      const parsed = dayjs(raw, fmt, true)
      const year = parsed.isValid() ? parsed.year() : dayjs(raw).year()

      if (!parsed.isValid() || year > 9999 || year < 100) {
        const msg = withTime
          ? "Invalid date/time format."
          : "Invalid date format."
        setError(msg)
        onValidate?.(name, msg)
        onChange?.(null)
        return
      }

      if (!isNull(minDate) && parsed.isBefore(dayjs(minDate), unit)) {
        const msg =
          translations?.minDate ??
          (dayjs(minDate).isSame(dayjs(), unit)
            ? withTime
              ? "Date/time cannot be in the past."
              : "Date cannot be in the past."
            : `Must be ≥ ${dayjs(minDate).format(fmt)}`)
        setError(msg)
        onValidate?.(name, msg)
        onChange?.(null)
        return
      }
      if (!isNull(maxDate) && parsed.isAfter(dayjs(maxDate), unit)) {
        const msg =
          translations?.maxDate ??
          (dayjs(maxDate).isSame(dayjs(), unit)
            ? withTime
              ? "Date/time cannot be in the future."
              : "Date cannot be in the future."
            : `Must be ≤ ${dayjs(maxDate).format(fmt)}`)
        setError(msg)
        onValidate?.(name, msg)
        onChange?.(null)
        return
      }

      const snapped = withTime
        ? parsed.minute(
            Math.round(parsed.minute() / Math.max(1, minuteStep)) *
              Math.max(1, minuteStep),
          )
        : parsed

      if (!sameByUnit(date, snapped, unit)) setDate(snapped)
      if (isString(error)) setError(undefined)
      onValidate?.(name, undefined)
      onChange?.(snapped)
    },
    [
      date,
      error,
      fmt,
      maxDate,
      minDate,
      minuteStep,
      name,
      onChange,
      onValidate,
      translations,
      unit,
      withTime,
    ],
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
      onChangeInput={emitRaw} // <- now just a string callback
    />
  )
}

export default DatePickerClient
