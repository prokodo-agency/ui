import dayjs from "dayjs"

import { isNull } from "@/helpers/validations"

import { InputView } from "../input/Input.view"

import type { DatePickerProps } from "./DatePicker.model"
import type { JSX, ChangeEvent, FormEvent } from "react"

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
  onChangeInput, // <- string-based adapter
  ...rest
}: DatePickerProps & {
  onChangeInput?: (raw: string) => void
}): JSX.Element {
  const effectiveFormat = format ?? (withTime ? "YYYY-MM-DDTHH:mm" : "YYYY-MM-DD")
  const inputType = withTime ? "datetime-local" : "date"
  const htmlMinMaxFormat = withTime ? "YYYY-MM-DDTHH:mm" : "YYYY-MM-DD"

  const displayValue = !isNull(value) ? dayjs(value).format(effectiveFormat) : ""
  const min = !isNull(minDate) ? dayjs(minDate).format(htmlMinMaxFormat) : undefined
  const max = !isNull(maxDate) ? dayjs(maxDate).format(htmlMinMaxFormat) : undefined
  const computedStep = withTime ? Math.max(1, minuteStep) * 60 : undefined

  // strip any incoming step for date-only inputs
  const { step: _ignored, ...restWithoutStep } = rest as { step?: unknown }

  // Adapters that satisfy InputView’s types
  const handleInput = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChangeInput?.((e.currentTarget as HTMLInputElement | HTMLTextAreaElement).value)
  }
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChangeInput?.(e.currentTarget.value)
  }

  return (
    <InputView
      {...restWithoutStep}
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
      onChange={handleChange}
      onInput={handleInput}
      {...(withTime && computedStep !== undefined ? { step: computedStep } : {})}
    />
  )
}
