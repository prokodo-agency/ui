import type { LabelProps } from "../label"
import type { InputProps as MUIInputProps } from "@mui/base"
import type { Ref, ChangeEventHandler, HTMLInputTypeAttribute } from "react"

// Please use for date fields the common DatePicker component
export type FieldType = Omit<
  HTMLInputTypeAttribute,
  "date" | "datetime-local" | "month" | "week" | "time"
>

export type InputChangeEvent = ChangeEventHandler<
  HTMLTextAreaElement | HTMLInputElement
>
export type InputValidateEvent = (name: string, error?: string) => void
export type InputColor =
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning"

export type InputErrorTranslations = {
  required?: string
  email?: string
  tel?: string
  text?: string
  url?: string
  number?: string
  color?: string
  password?: string
  min?: string
  max?: string
}

export type InputProps = {
  inputRef?: Ref<HTMLInputElement>
  customRegexPattern?: string
  fieldClassName?: string
  hideCounter?: boolean
  inputContainerClassName?: string
  inputClassName?: string
  fullWidth?: boolean
  required?: boolean
  color?: InputColor
  name: string
  label?: string
  labelProps?: Omit<LabelProps, "label" | "require" | "error" | "htmlFor">
  errorTranslations?: InputErrorTranslations
  min?: number
  max?: number
  maxLength?: number
  value?: string | number | undefined
  hideLegend?: boolean
  errorText?: string
  helperText?: string
  onChange?: InputChangeEvent
  onValidate?: InputValidateEvent
} & (
  | {
      // Single-line input properties
      multiline?: false
      type?: FieldType
      maxRows?: undefined
      minRows?: undefined
      rows?: undefined
    }
  | {
      // Multi-line input properties
      multiline: true
      type?: undefined
      maxRows?: number
      minRows?: number
      rows?: number
    }
) &
  Omit<
    MUIInputProps,
    | "inputRef"
    | "variant"
    | "color"
    | "name"
    | "onChange"
    | "type"
    | "multiline"
    | "maxRows"
    | "minRows"
    | "rows"
    | "error"
  >
