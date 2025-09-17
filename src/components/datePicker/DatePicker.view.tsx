import dayjs from "dayjs"

import { isNull } from "@/helpers/validations"

import { InputView } from "../input/Input.view"

import type { DatePickerProps } from "./DatePicker.model"
import type { ChangeEvent, JSX } from "react"

export function DatePickerView({
  name,
  label,
  value,
  helperText,
  errorText,
  format,
  placeholder,
  minDate,
  maxDate,
  withTime = false,
  minuteStep = 1,
  ...rest
}: DatePickerProps & {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}): JSX.Element {
  const effectiveFormat = format ?? (withTime ? "YYYY-MM-DDTHH:mm" : "YYYY-MM-DD")
  const inputType = withTime ? "datetime-local" : "date"
  const htmlMinMaxFormat = withTime ? "YYYY-MM-DDTHH:mm" : "YYYY-MM-DD"

  const displayValue = !isNull(value) ? dayjs(value).format(effectiveFormat) : ""
  const min = !isNull(minDate) ? dayjs(minDate).format(htmlMinMaxFormat) : undefined
  const max = !isNull(maxDate) ? dayjs(maxDate).format(htmlMinMaxFormat) : undefined

  // If the caller already passes a step in `rest`, prefer minuteStep only when withTime is true.
  const step = withTime ? Math.max(1, minuteStep) * 60 : rest?.step

  return (
    <InputView
      {...rest}
      errorText={errorText}
      helperText={helperText}
      isFocused={true}
      label={label}
      max={max}
      min={min}
      name={name}
      placeholder={placeholder}
      type={inputType}
      value={displayValue}
      {...(withTime ? { step } : {})}
    />
  )
}
