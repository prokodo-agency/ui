"use client"
import {
  type FC,
  type ReactNode,
  type FocusEvent,
  type ChangeEvent,
  memo,
  useCallback,
} from "react"

import { create } from "@/helpers/bem"

import {
  DatePicker,
  type DatePickerProps,
  type DatePickerValue,
} from "../datePicker"
import { GridRow } from "../grid"
import { Input, type InputProps } from "../input"
import {
  Select,
  type SelectProps,
  type SelectEvent,
} from "../select"
import { Slider, type SliderProps } from "../slider"
import { Switch, type SwitchProps } from "../switch"

import styles from "./FormField.module.scss"

import type {
  FormVariants,
  FormFieldMessages,
  FormField as FormFieldModel,
  FormFieldValue,
} from "./Form.model"

const bem = create(styles, "FormField")

export type FormFieldProps = Omit<FormFieldModel, "onChange"> & {
  variant?: FormVariants
  messagesFields?: FormFieldMessages
  onChange?: (field: FormFieldModel, value?: FormFieldValue) => void
  onValidate?: (field: FormFieldModel, err?: string) => void
}

export const FormField: FC<FormFieldProps> = memo(
  ({
    fieldType,
    visible,
    variant = "primary",
    messagesFields,
    onChange,
    onValidate,
    ...props
  }) => {
    const renderFieldContainer = useCallback(
      (children: ReactNode) => (
        <GridRow className={bem()} xs={12}>
          {children}
        </GridRow>
      ),
      [],
    )
    if (visible === false) return null
    switch (fieldType) {
      case "switch":
        return renderFieldContainer(
          <Switch
            {...(props as SwitchProps)}
            onChange={(_: ChangeEvent<HTMLInputElement>, checked: boolean) =>
              onChange?.(props as FormFieldModel, checked)
            }
          />,
        )
      case "slider":
        return renderFieldContainer(
          <Slider
            {...(props as SliderProps)}
            onChange={(_: Event, value: number | number[]) =>
              onChange?.(props as FormFieldModel, value?.toString())
            }
          />,
        )
      case "select":
        return renderFieldContainer(
          <Select
            {...(props as SelectProps)}
            onChange={(_: SelectEvent, value: string | string[] | null) =>
              onChange?.(props as FormFieldModel, value ?? undefined)
            }
          />,
        )
      case "input":
        return renderFieldContainer(
          <Input
            errorTranslations={messagesFields?.errors?.input}
            onValidate={(_, err) => onValidate?.(props as FormFieldModel, err)}
            onChange={(e: FocusEvent<HTMLInputElement>) =>
              onChange?.(props as FormFieldModel, e.target.value)
            }
            {...(props as InputProps)}
          />,
        )
      case "date":
        return renderFieldContainer(
          <DatePicker
            {...(props as DatePickerProps)}
            errorTranslations={messagesFields?.errors?.date}
            onValidate={(_, err) => onValidate?.(props as FormFieldModel, err)}
            onChange={(value: DatePickerValue) =>
              onChange?.(
                props as FormFieldModel,
                value?.format("YYYY-MM-DDTHH:mm:ssZ"),
              )
            }
          />,
        )
      default:
        return null
    }
  },
)

FormField.displayName = "FormField"
