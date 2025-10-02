/* eslint-disable */
import type {
  FormEvent,
  ReactElement,
  FormHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
} from "react"
import type { ButtonProps } from "../button"
import type { HeadlineProps } from "../headline"

import {
  DatePicker,
  type DatePickerProps,
  type DatePickerErrorTranslations,
} from "../datePicker"
import { DynamicList, type DynamicListProps } from "../dynamic-list"
import { Input, type InputProps, type InputErrorTranslations } from "../input"
import { InputOTP } from "../inputOTP"
import { Select, type SelectProps } from "../select"
import { Slider, type SliderProps } from "../slider"
import { Switch, type SwitchProps } from "../switch"
import type { FormFieldProps } from "./FormField.client"
/* eslint-enable */

export type FormVariants =
  | "inherit"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning"

export type FormFieldTypes =
  | "input"
  | "select"
  | "switch"
  | "slider"
  | "date"
  | "dynamic-list"

export type FormFieldValue =
  | string
  | boolean
  | string[]
  | Record<string, string>[]
  | undefined

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

export type FormFieldDynamicList = FormFieldOptionals & {
  fieldType: "dynamic-list"
} & DynamicListProps

export type FormField =
  | FormFieldInput
  | FormFieldSelect
  | FormFieldSwitch
  | FormFieldSlider
  | FormFieldDate
  | FormFieldDynamicList

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
  | ReactElement<typeof DynamicList>

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
  disabled?: boolean
  variant?: FormVariants
  hideResponse?: boolean
  fields?: FormField[]
  hideHeadline?: boolean
  headlineProps?: HeadlineProps
  defaultFields?: FormField[]
  messages?: FormMessages
  messagesFields?: FormFieldMessages
  button?: FormButton
  onSubmit?: (fields: FormField[]) => void
  onChangeForm?: OnChangeFormHandler
} & Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit">

export type FormViewProps = FormProps & {
  formState: Omit<FormField, "onChange">[]
  formMessages?: FormMessages
  honeypot: InputHTMLAttributes<HTMLInputElement>
  isHoneypotEmpty?: boolean
  fieldProps?: FormFieldProps
  onFormSubmit: (e: FormEvent<HTMLFormElement>) => void
  isFormValid: boolean
}
