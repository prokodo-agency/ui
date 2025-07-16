import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import { Button, type ButtonProps } from "../button"
import { Input, type InputProps } from "../input"
import { Label } from "../label"

import styles from "./DynamicList.module.scss"

import type { DynamicListProps, DynamicListField } from "./DynamicList.model"
import type { ReactNode } from "react"

const bem = create(styles, "DynamicList")

type DynamicListViewProps = Omit<DynamicListProps, "onChange" | "buttonAddProps" | "buttonDeleteProps"> & {
  fieldProps?: Omit<InputProps, "fieldType" | "multiline" | "rows" | "minRows" | "maxRows" | "type" | "name">
  buttonAddProps?: Omit<ButtonProps, "title">
  buttonDeleteProps?: Omit<ButtonProps, "title">
  readOnly?: boolean
}

export function DynamicListView({
  id,
  label,
  labelProps,
  disabled,
  required,
  className,
  classNameList,
  fields,
  value = [],
  fieldProps,
  buttonAddProps,
  buttonDeleteProps,
  name = "items",
  errorText,
  helperText,
}: DynamicListViewProps): ReactNode {
  const isError   = Boolean(errorText)
  const hasHelper   = Boolean(helperText)
  const errorId   = isError   ? `${id}-error`  : undefined
  const helperId  = hasHelper ? `${id}-helper` : undefined
  const single = fields.length === 1
  const mod =  {"is-multi": !Boolean(single)}
  return (
    <fieldset
      aria-describedby={isError ? errorId : helperId}
      aria-labelledby={`${name}-legend`}
      className={bem(undefined, undefined, className)}
    >
      {/* ————————————— wrapper-level label ————————————— */}
      {isString(label) && (
        <Label
          {...labelProps}
          aria-disabled={disabled}
          className={bem("list-label", undefined, labelProps?.className)}
          error={isError}
          id={labelProps?.id ?? `${name}-legend`}
          label={label}
          required={required}
          type="legend"
        />
      )}

      {value.map((item, idx) => (
        <ul
          // eslint-disable-next-line react/no-array-index-key
          key={idx}
          aria-describedby={errorId ?? helperId}
          className={bem("list", mod, classNameList)}
        >
          <li className={bem("list__item")}>
            {fields.map((field: DynamicListField) => (
              <Input
                key={field.name}
                fullWidth
                {...field}
                {...fieldProps}
                className={bem("field", mod, field?.className)}
                data-field={field?.name}
                data-index={idx}
                disabled={disabled ?? fieldProps?.disabled ?? field?.disabled}
                id={`${name}-${idx}-${field.name}`}
                required={required ?? fieldProps?.required ?? field?.required}
                value={single ? item : item[field.name]}
                name={
                  single
                    ? `${name}[${idx}]`
                    : `${name}[${idx}].${field.name}`
                }
              />
            ))}
          </li>
          <Button
            aria-label={`Remove ${label} entry ${idx + 1}`}
            color="error"
            data-index={idx}
            iconProps={{
                name: "Delete02Icon",
            }}
            {...buttonDeleteProps}
            className={bem("delete__button", mod, buttonDeleteProps?.className)}
          />
        </ul>
      ))}
      <Button
        title="Add item"
        variant="outlined"
        {...buttonAddProps}
        className={bem("button", undefined, buttonAddProps?.className)}
      />

      {/* ------------------------------------------------ helper / error */}
      {(isError || hasHelper) && (
        <div
          aria-live={isError ? "assertive" : "polite"}
          className={bem("helperText")}
          id={errorId ?? helperId}
          role={isError ? "alert" : undefined}
        >
          <span
            className={bem("helperText__content", {
              "is-error": isError,
            })}
          >
            {errorText ?? helperText}
          </span>
        </div>
      )}
    </fieldset>
  )
}