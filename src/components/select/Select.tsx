"use client"
import { Option as BaseOption } from "@mui/base/Option"
import { Select as BaseSelect } from "@mui/base/Select"
import { type FC, useState, useEffect, useCallback, memo } from "react"

import { create } from "@/helpers/bem"
import { isString, isNull, isTrue } from "@/helpers/validations"

import { Label } from "../label"

import styles from "./Select.module.scss"

import type { SelectProps, SelectEvent } from "./Select.model"

const bem = create(styles, "Select")

export const Select: FC<SelectProps> = memo(
  ({
    id,
    iconVisible,
    required,
    multiple,
    value,
    placeholder,
    color = "primary",
    label,
    labelProps = {},
    hideLabel,
    className,
    classNameSelect,
    items,
    slotProps,
    errorText,
    helperText,
    onChange,
    ...props
  }) => {
    const [Value, setValue] = useState<string | string[] | null>(
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      (value ?? multiple) ? [] : "default",
    )

    useEffect(() => {
      if (value !== undefined) {
        setValue(value)
      }
    }, [value, Value])

    const handleChange = useCallback(
      (e: SelectEvent, newValue: string | string[] | null) => {
        if (newValue !== null) {
          setValue(newValue)
          onChange?.(e, newValue)
        }
      },
      [onChange],
    )

    const labelId = `${id}-label`
    const errorId = `${id}-error`
    const helperId = `${id}-helper`
    const [expanded, setExpanded] = useState<boolean>(false)
    if (
      Array.isArray(items)
        ? items.length === 0
        : Object.keys(items).length === 0
    ) {
      return null
    }
    const expandedModifier = {
      expanded: expanded,
    }
    const Placeholder = placeholder ?? "-- Please choose --"
    const isError = isString(errorText)
    const isRequired = required === true
    const isMultiple = multiple === true
    const hasHelperText = isString(helperText)
    return (
      <div className={bem(undefined, undefined, className)}>
        {(hideLabel === undefined || hideLabel === false) && (
          <Label
            {...labelProps}
            error={isError}
            htmlFor={labelId}
            label={label}
            required={required}
          />
        )}
        <div
          className={bem("field", {
            ...expandedModifier,
            [color]: !!color,
          })}
        >
          <BaseSelect
            {...props}
            aria-invalid={isError}
            aria-labelledby={labelId}
            aria-required={Boolean(required) ? "true" : undefined}
            className={bem("select", undefined, classNameSelect)}
            id={id}
            multiple={multiple}
            required={required}
            slots={{ root: "button", listbox: "ul", popup: "div" }}
            value={Value}
            aria-describedby={
              isError ? errorId : hasHelperText ? helperId : undefined
            }
            renderValue={selected => {
              // Hide placeholder if required or if a value will be set
              if (
                (selected === null && (isRequired || isMultiple)) ||
                (Array.isArray(selected) &&
                  selected.length === 0 &&
                  (isRequired || isMultiple))
              ) {
                return (
                  <span
                    className={bem("button__inner", {
                      "is-placeholder": true,
                    })}
                  >
                    {Placeholder}
                  </span>
                )
              }
              if (Array.isArray(selected)) {
                const selectedItem = items?.find(el => el.value === value)
                return (
                  <span className={bem("button__inner", expandedModifier)}>
                    {isTrue(iconVisible) &&
                      !isNull(selectedItem?.icon?.()) &&
                      selectedItem?.icon?.()}
                    {selected.map(option => option.label).join(", ")}
                  </span>
                )
              }
              const selectedItem = items?.find(
                el => el.value === selected?.value,
              )
              return (
                <span className={bem("button__inner", expandedModifier)}>
                  {isTrue(iconVisible) &&
                    !isNull(selectedItem?.icon?.()) &&
                    selectedItem?.icon?.()}
                  {selected?.label}
                </span>
              )
            }}
            slotProps={{
              ...slotProps,
              root: {
                ...slotProps?.root,
                className: bem("button", expandedModifier),
                role: "button",
                "aria-haspopup": "listbox",
                "aria-expanded": expanded ? "true" : "false",
              },
              listbox: {
                ...slotProps?.listbox,
                className: bem("listbox"),
                role: "listbox",
              },
              popup: {
                ...slotProps?.popup,
                disablePortal: true,
                className: bem("popup", {
                  "is-expanded": expanded,
                }),
              },
            }}
            onChange={handleChange}
            onListboxOpenChange={isOpen => setExpanded(isOpen)}
          >
            {/* Instead of placeholder render item if select is optional */}
            {!isRequired && !isMultiple && (
              <BaseOption
                aria-label={Placeholder.toString()}
                aria-selected={"default" === Value ? "true" : "false"}
                value="default"
                className={bem("item", {
                  selected: "default" === Value,
                })}
              >
                {Placeholder}
              </BaseOption>
            )}
            {items.map(item => {
              const { icon, ...rest } = item
              const selected =
                item?.value === Value || Value?.includes(item?.value)
              const isSelected = selected === true
              return (
                <BaseOption
                  key={`${labelId}-item-${item?.value}`}
                  className={bem(
                    "item",
                    {
                      selected: isSelected && !isMultiple,
                    },
                    item?.className,
                  )}
                  {...rest}
                  aria-label={item?.label}
                  aria-selected={isSelected ? "true" : "false"}
                >
                  {isMultiple && (
                    <input
                      aria-hidden="true"
                      defaultChecked={isSelected}
                      type="checkbox"
                      className={bem("checkbox", {
                        checked: isSelected,
                      })}
                    />
                  )}
                  {icon && icon()}
                  {item?.label}
                </BaseOption>
              )
            })}
          </BaseSelect>
        </div>

        {/* Render helper text or error message */}
        {(isError || hasHelperText) && (
          <div
            aria-live={isError ? "assertive" : "polite"}
            className={bem("helperText", { "is-error": isError })}
            id={isError ? errorId : helperId}
            role={isError ? "alert" : undefined}
          >
            <span className={bem("helperText__content")}>
              {errorText ?? helperText}
            </span>
          </div>
        )}
      </div>
    )
  },
)

Select.displayName = "Select"
