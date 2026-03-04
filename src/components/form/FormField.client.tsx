import { type JSX, type ReactNode, type ChangeEvent, useCallback } from "react"

import { create } from "@/helpers/bem"

import { Autocomplete, type AutocompleteProps } from "../autocomplete"
import { Checkbox, type CheckboxProps } from "../checkbox"
import { CheckboxGroup, type CheckboxGroupProps } from "../checkbox-group"
import {
  DatePicker,
  type DatePickerProps,
  type DatePickerValue,
} from "../datePicker"
import { DynamicList, type DynamicListProps } from "../dynamic-list"
import { GridRow } from "../grid"
import { Input, type InputProps } from "../input"
import { Rating, type RatingProps, type RatingChangeEvent } from "../rating"
import { Select, type SelectEvent, type SelectProps } from "../select"
import { Slider, type SliderProps } from "../slider"
import { Switch, type SwitchProps, type SwitchColor } from "../switch"

import styles from "./Form.module.scss"

import type {
  FormVariants,
  FormFieldValue,
  FormFieldMessages,
  FormField as FormFieldModel,
} from "./Form.model"

const bem = create(styles, "FormField")

export type FormFieldProps = Omit<FormFieldModel, "onChange"> & {
  color?: FormVariants
  messagesFields?: FormFieldMessages
  onChange?: (field: FormFieldModel, value?: FormFieldValue) => void
  onValidate?: (field: FormFieldModel, err?: string) => void
}

export default function FormFieldClient({
  fieldType,
  visible,
  color,
  messagesFields,
  onChange,
  onValidate,
  ...props
}: FormFieldProps): JSX.Element | null {
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
          priority
          color={color as SwitchColor}
          {...(props as SwitchProps)}
          // drive the switch from the field's value (boolean)
          checked={
            typeof props?.value === "boolean"
              ? Boolean(props?.value)
              : (props as SwitchProps).checked
          }
          onChange={(_: ChangeEvent<HTMLInputElement>, checked: boolean) =>
            onChange?.(props as FormFieldModel, checked)
          }
        />,
      )
    case "slider":
      return renderFieldContainer(
        <Slider
          priority
          color={color}
          {...(props as SliderProps)}
          onChange={(
            _: ChangeEvent<HTMLInputElement>,
            value: number | number[],
          ) => onChange?.(props as FormFieldModel, value?.toString())}
        />,
      )
    case "select":
      return renderFieldContainer(
        <Select
          priority
          color={color}
          {...(props as SelectProps)}
          onChange={
            /* istanbul ignore next */ (
              _: SelectEvent,
              value: string | string[] | null,
            ) => onChange?.(props as FormFieldModel, value ?? undefined)
          }
        />,
      )
    case "input":
      return renderFieldContainer(
        <Input
          priority
          color={color}
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
          color={color}
          {...(props as DatePickerProps)}
          translations={messagesFields?.errors?.date}
          onValidate={(_, err) => onValidate?.(props as FormFieldModel, err)}
          onChange={(value: DatePickerValue) =>
            onChange?.(
              props as FormFieldModel,
              typeof value === "object"
                ? value?.format("YYYY-MM-DDTHH:mm:ssZ")
                : /* istanbul ignore next */ value,
            )
          }
        />,
      )
    case "dynamic-list":
      const p = props as DynamicListProps
      return renderFieldContainer(
        <DynamicList
          priority
          color={color}
          {...p}
          value={p?.value as Record<string, string>[]}
          fields={p?.fields?.map(field => ({
            ...field,
            onValidate: (_, err) => onValidate?.(p as FormFieldModel, err),
          }))}
          onChange={(items: Record<string, string>[] | string[]) =>
            onChange?.(props as FormFieldModel, items)
          }
        />,
      )
    case "rating":
      return renderFieldContainer(
        <Rating
          priority
          color={color}
          {...(props as RatingProps)}
          errorTranslations={messagesFields?.errors?.input}
          onValidate={(_, err) => onValidate?.(props as FormFieldModel, err)}
          onChange={(e: RatingChangeEvent) =>
            onChange?.(props as FormFieldModel, e?.value?.toString())
          }
        />,
      )
    case "checkbox":
      return renderFieldContainer(
        <Checkbox
          priority
          color={color}
          {...(props as CheckboxProps)}
          checked={
            typeof props?.value === "boolean"
              ? Boolean(props?.value)
              : (props as CheckboxProps).checked
          }
          onChange={(_: ChangeEvent<HTMLInputElement>, checked: boolean) =>
            onChange?.(props as FormFieldModel, checked)
          }
        />,
      )
    case "checkbox-group":
      return renderFieldContainer(
        <CheckboxGroup
          priority
          color={color}
          {...(props as CheckboxGroupProps<string>)}
          values={
            Array.isArray(props?.value)
              ? (props.value as string[])
              : (props as CheckboxGroupProps<string>).values
          }
          onChange={(next: string[]) =>
            onChange?.(props as FormFieldModel, next)
          }
        />,
      )
    case "autocomplete":
      return renderFieldContainer(
        <Autocomplete
          priority
          color={color}
          {...(props as AutocompleteProps)}
          value={
            typeof props?.value === "string"
              ? props.value
              : (props as AutocompleteProps).value
          }
          onChange={({ query }) => onChange?.(props as FormFieldModel, query)}
          onSelect={item => onChange?.(props as FormFieldModel, item.value)}
        />,
      )
    default:
      return null
    /* istanbul ignore next */
  }
  /* istanbul ignore next */
}
