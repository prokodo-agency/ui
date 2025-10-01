import { type JSX, type ReactNode, type ChangeEvent, useCallback } from "react"

import { create } from "@/helpers/bem"

import {
  DatePicker,
  type DatePickerProps,
  type DatePickerValue,
} from "../datePicker"
import {
  DynamicList,
  type DynamicListProps
} from "../dynamic-list"
import { GridRow } from "../grid"
import { Input, type InputProps } from "../input"
import {
  Select,
  type SelectEvent,
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

const bem = create(styles, "FormField")

export type FormFieldProps = Omit<FormFieldModel, "onChange"> & {
  variant?: FormVariants
  messagesFields?: FormFieldMessages
  onChange?: (field: FormFieldModel, value?: FormFieldValue) => void
  onValidate?: (field: FormFieldModel, err?: string) => void
}

export default function FormFieldClient({
  fieldType,
  visible,
  variant,
  messagesFields,
  onChange,
  onValidate,
  ...props
}: FormFieldProps): JSX.Element | null {
  const renderFieldContainer = useCallback((children: ReactNode) => (
    <GridRow className={bem()} xs={12}>
      {children}
    </GridRow>
  ), [])
  if (visible === false) return null
    switch (fieldType) {
      case "switch":
        return renderFieldContainer(
          <Switch
            priority
            color={variant as SwitchColor}
            {...(props as SwitchProps)}
            // drive the switch from the field's value (boolean)
            checked={typeof props?.value === "boolean"
              ? Boolean(props?.value)
              : (props as SwitchProps).checked}
            onChange={(_: ChangeEvent<HTMLInputElement>, checked: boolean) =>
              onChange?.(props as FormFieldModel, checked)
            }
          />
        )
      case "slider":
        return renderFieldContainer(
          <Slider
            priority
            {...(props as SliderProps)}
            onChange={(_: ChangeEvent<HTMLInputElement>, value: number | number[]) =>
              onChange?.(props as FormFieldModel, value?.toString())
            }
          />,
        )
      case "select":
        return renderFieldContainer(
          <Select
            priority
            {...(props as SelectProps)}
            onChange={(_: SelectEvent, value: string | string[] | null) =>
              onChange?.(props as FormFieldModel, value ?? undefined)
            }
          />,
        )
      case "input":
        return renderFieldContainer(
          <Input
            priority
            errorTranslations={messagesFields?.errors?.input}
            onValidate={(_, err) => onValidate?.(props as FormFieldModel, err)}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange?.(props as FormFieldModel, e.target.value)
            }
            {...(props as InputProps)}
          />,
        )
      case "date":
        return renderFieldContainer(
          <DatePicker
            priority
            {...(props as DatePickerProps)}
            translations={messagesFields?.errors?.date}
            onValidate={(_, err) => onValidate?.(props as FormFieldModel, err)}
            onChange={(value: DatePickerValue) =>
              onChange?.(
                props as FormFieldModel,
                typeof value === "object" ? value?.format("YYYY-MM-DDTHH:mm:ssZ") : value,
              )
            }
          />,
        )
      case "dynamic-list":
        const p  = (props as DynamicListProps)
        return renderFieldContainer(
          <DynamicList
            priority
            {...p}
            value={p?.value as Record<string, string>[]}
            fields={
              p?.fields?.map(field => ({
                ...field,
                onValidate: (_, err) => onValidate?.(p as FormFieldModel, err)
              }))
            }
            onChange={(items: Record<string, string>[] | string[]) =>
              onChange?.(
                props as FormFieldModel,
                items,
              )
            }
          />,
        )
      default:
        return null
    }
}
