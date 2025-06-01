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
  format = "YYYY-MM-DD",
  placeholder,
  minDate,
  maxDate,
  ...rest
}: DatePickerProps & {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}): JSX.Element {
  const displayValue = !isNull(value) ? dayjs(value).format(format) : ""
  const min = !isNull(minDate) ? dayjs(minDate).format("YYYY-MM-DD") : undefined
  const max = !isNull(maxDate) ? dayjs(maxDate).format("YYYY-MM-DD") : undefined

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
      type="date"
      value={displayValue}
    />
  )
}
