import dayjs from "dayjs"
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
  const displayValue = value ? dayjs(value).format(format) : ""
  const min = minDate ? dayjs(minDate).format("YYYY-MM-DD") : undefined
  const max = maxDate ? dayjs(maxDate).format("YYYY-MM-DD") : undefined

  return (
    <InputView
      {...rest}
      isFocused={true}
      name={name}
      label={label}
      placeholder={placeholder}
      type="date"
      value={displayValue}
      helperText={helperText}
      errorText={errorText}
      min={min}
      max={max}
    />
  )
}
