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
import { Switch, type SwitchProps, type SwitchColor } from "../switch"

import styles from "./FormField.module.scss"

import type {
  FormVariants,
  FormFieldValue,
  FormFieldMessages,
  FormField as FormFieldModel,
} from "./Form.model"
import type { JSX, ReactNode } from "react"

const bem = create(styles, "FormField")

export type FormFieldProps = Omit<FormFieldModel, "onChange"> & {
  variant?: FormVariants
  messagesFields?: FormFieldMessages
  onChange?: (field: FormFieldModel, value?: FormFieldValue) => void
  onValidate?: (field: FormFieldModel, err?: string) => void
}

export default function FormFieldServer({
  fieldType,
  visible,
  variant,
  messagesFields,
  ...props
}: FormFieldProps): JSX.Element | null {
  delete props?.onChange
  delete props?.onValidate
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
            color={variant as SwitchColor}
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