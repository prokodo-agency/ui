/* eslint-disable */
import type { FormEvent, ReactElement, FormHTMLAttributes, HTMLAttributes, InputHTMLAttributes } from "react"
import type { ButtonProps } from "../button"

import {
  DatePicker,
  type DatePickerProps,
  type DatePickerErrorTranslations,
} from "../datePicker"
import { Input, type InputProps, type InputErrorTranslations } from "../input"
import { InputOTP } from "../inputOTP"
import { Select, type SelectProps } from "../select"
import { Slider, type SliderProps } from "../slider"
import { Switch, type SwitchProps } from "../switch"
/* eslint-enable */

export type FormVariants =
  | "inherit"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning"

export type FormFieldTypes = "input" | "select" | "switch" | "slider" | "date"

export type FormFieldValue = string | boolean | string[] | undefined

export type FormFieldCondition = {
  fieldId: string
  equalTo: boolean | string | string[]
  updateProps: Partial<FormField>
}

export type FormFieldOptionals = {
  fieldType?: FormFieldTypes
  visible?: boolean
  conditions?: FormFieldCondition[]
  value?: FormFieldValue
}

export type FormFieldInput = FormFieldOptionals & {
  fieldType: "input"
} & InputProps

export type FormFieldSelect = FormFieldOptionals & {
  fieldType: "select"
} & SelectProps

export type FormFieldSwitch = FormFieldOptionals & {
  fieldType: "switch"
} & SwitchProps

export type FormFieldSlider = FormFieldOptionals & {
  fieldType: "slider"
} & SliderProps

export type FormFieldDate = FormFieldOptionals & {
  fieldType: "date"
} & DatePickerProps

export type FormField =
  | FormFieldInput
  | FormFieldSelect
  | FormFieldSwitch
  | FormFieldSlider
  | FormFieldDate

export type FormMessagesErrors = {
  [key: string]: string[]
}

export type FormMessages = {
  message?: string
  errors?: FormMessagesErrors
}

export type FormFieldMessagesErrorsInput = InputErrorTranslations
export type FormFieldMessagesErrorsDate = DatePickerErrorTranslations

export type FormFieldMessagesErrors = {
  required?: string
  input?: FormFieldMessagesErrorsInput
  date?: FormFieldMessagesErrorsDate
}

export type FormFieldMessages = {
  errors?: FormFieldMessagesErrors
}

export type FormAllowedChildren =
  | ReactElement<typeof DatePicker>
  | ReactElement<typeof Input>
  | ReactElement<typeof InputOTP>
  | ReactElement<typeof Select>
  | ReactElement<typeof Slider>
  | ReactElement<typeof Switch>

export type ParentComponentProps = {
  children: FormAllowedChildren | FormAllowedChildren[] // Allow one or multiple allowed children
}

export type FormResponseProps = HTMLAttributes<HTMLDivElement> & {
  messages?: FormMessages
}

export type OnChangeFormHandler = (fields: FormField) => void

export type FormButton = Omit<ButtonProps, "title"> & {
  title?: string
}

export type FormProps = {
  label: string
  variant?: FormVariants
  hideResponse?: boolean
  fields?: FormField[]
  defaultFields?: FormField[]
  messages?: FormMessages
  messagesFields?: FormFieldMessages
  button: FormButton
  onSubmit?: (fields: FormField[]) => void
  onChangeForm?: OnChangeFormHandler
} & FormHTMLAttributes<HTMLFormElement>

export type FormViewProps = FormProps & {
  formState: FormField[]
  formMessages?: FormMessages
  honeypot: InputHTMLAttributes<HTMLInputElement>
  fieldProps?: FormField
  onFormSubmit: (e: FormEvent<HTMLFormElement>) => void
  isFormValid: boolean
}
