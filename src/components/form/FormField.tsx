import { create } from "@/helpers/bem"

import {
  DatePicker,
  type DatePickerProps,
} from "../datePicker"
import { GridRow } from "../grid"
import { Input, type InputProps } from "../input"
import {
  Select,
  type SelectProps,
} from "../select"
import { Slider, type SliderProps } from "../slider"
import { Switch, type SwitchProps } from "../switch"

import styles from "./FormField.module.scss"

import type {
  FormVariants,
  FormFieldTypes,
  FormFieldMessages,
  FormField as FormFieldModel,
} from "./Form.model"
import type { FC, ReactNode } from "react"

const bem = create(styles, "FormField")

export type FormFieldProps = Omit<FormFieldModel, "fieldType"> & {
  fieldType?: FormFieldTypes
  variant?: FormVariants
  messagesFields?: FormFieldMessages
}

export const FormField: FC<FormFieldProps> = ({
  fieldType,
  visible,
  messagesFields,
  ...props
}) => {
  const renderFieldContainer = (children: ReactNode) => (
    <GridRow className={bem()} xs={12}>
      {children}
    </GridRow>
  )
  if (visible === false) return null
  switch (fieldType) {
    case "switch":
      return renderFieldContainer(
        <Switch
          {...(props as SwitchProps)}
        />,
      )
    case "slider":
      return renderFieldContainer(
        <Slider
          {...(props as SliderProps)}
        />,
      )
    case "select":
      return renderFieldContainer(
        <Select
          {...(props as SelectProps)}
        />,
      )
    case "input":
      return renderFieldContainer(
        <Input
          errorTranslations={messagesFields?.errors?.input}
          {...(props as InputProps)}
        />,
      )
    case "date":
      return renderFieldContainer(
        <DatePicker
          {...(props as DatePickerProps)}
          translations={messagesFields?.errors?.date}
        />,
      )
    default:
      return null
  }
  }

FormField.displayName = "FormField"
