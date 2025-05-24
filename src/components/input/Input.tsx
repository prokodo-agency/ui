"use client"
import {
  Input as MUIInput,
  type SingleLineInputProps,
  type MultiLineInputProps,
} from "@mui/base"
import {
  type FC,
  type HTMLInputTypeAttribute,
  useState,
  memo,
  useCallback,
  useEffect,
} from "react"

import { create } from "@/helpers/bem"
import { isString, isNull } from "@/helpers/validations"

import { Label } from "../label"

import styles from "./Input.module.scss"
import { handleValidation } from "./InputValidation"

import type { InputProps } from "./Input.model"

const bem = create(styles, "Input")

export const Input: FC<InputProps> = memo(
  ({
    fullWidth,
    inputRef,
    hideCounter,
    type,
    color = "primary",
    value,
    name,
    min,
    max,
    multiline,
    maxRows,
    minRows,
    rows,
    disabled,
    maxLength,
    placeholder,
    label,
    customRegexPattern,
    errorTranslations,
    labelProps = {},
    className,
    fieldClassName,
    inputContainerClassName,
    inputClassName,
    required,
    hideLegend,
    errorText,
    helperText,
    onFocus,
    onBlur,
    onChange,
    onValidate,
    ...props
  }) => {
    const [Value, setValue] = useState<string | number | undefined>(value)
    const [focused, setFocused] = useState<boolean>(false)

    useEffect(() => {
      if (!isNull(value)) {
        setValue(value)
      }
    }, [value])

    const renderPlaceholder = useCallback((): string | undefined => {
      switch (type) {
        case "url":
          return "www.example.com"
        case "email":
          return "muster@example.com"
        case "tel":
          return "+49123456789"
        case "color":
          return "#FFFFFF"
        default:
          return placeholder
      }
    }, [type, placeholder])

    const isError = isString(errorText)
    const isRequired = required === true
    // Conditionally set the multiline props
    const inputProps = Boolean(multiline)
      ? ({
          multiline,
          maxRows,
          minRows: minRows ?? 3,
          rows,
        } as MultiLineInputProps)
      : ({
          multiline: false,
          maxRows: undefined,
          minRows: undefined,
          type: type as HTMLInputTypeAttribute,
        } as SingleLineInputProps)
    return (
      <div className={bem(undefined, { [color]: !!color }, className)}>
        {isString(label) && (
          <Label
            {...labelProps}
            className={bem("label", undefined, labelProps?.className)}
            error={isError}
            htmlFor={name}
            label={label}
            required={isRequired}
          />
        )}
        <div className={bem("field", undefined, fieldClassName)}>
          <MUIInput
            aria-required={isRequired ? "true" : undefined}
            color={color}
            id={name}
            {...props}
            {...inputProps}
            aria-invalid={isError}
            disabled={disabled}
            error={isError}
            name={name}
            placeholder={renderPlaceholder()}
            required={isRequired}
            value={Value ?? ""}
            aria-describedby={
              isError
                ? `${name}-error`
                : isString(helperText)
                  ? `${name}-helper`
                  : undefined
            }
            className={bem(
              "input",
              {
                focused,
                multiline: Boolean(multiline),
                disabled: Boolean(disabled),
                fullWidth: Boolean(fullWidth),
              },
              inputContainerClassName,
            )}
            slotProps={{
              input: {
                ref: inputRef,
                className: bem(
                  "input__node",
                  {
                    multiline: Boolean(multiline),
                  },
                  inputClassName,
                ),
              },
            }}
            onBlur={e => {
              onBlur?.(e)
              setFocused(false)
            }}
            onChange={e => {
              const { value } = e.target
              if (maxLength !== undefined && value.length > maxLength) return
              setValue(e.target.value)
              handleValidation?.(
                type === undefined ? "text" : type,
                name,
                e?.target?.value,
                required,
                min,
                max,
                customRegexPattern,
                errorTranslations,
                onValidate,
              )
              if (onChange) {
                onChange(e)
              }
            }}
            onFocus={e => {
              onFocus?.(e)
              setFocused(true)
            }}
          />
        </div>
        <div className={bem("footer")}>
          {/* Helper Text and Error Text */}
          {isError ||
          isString(helperText) ||
          (max !== undefined && Value !== undefined) ? (
            <div
              aria-live={isError ? "assertive" : "polite"}
              className={bem("helperText")}
              id={isError ? `${name}-error` : `${name}-helper`}
              role={isError ? "alert" : undefined}
            >
              <span
                role="alert"
                className={bem("helperText__content", {
                  "is-error": Boolean(errorText),
                })}
              >
                {errorText ?? helperText}
              </span>
              {max !== undefined &&
                Value !== undefined &&
                hideLegend === false && (
                  <span className={bem("helperText__legend")}>
                    {Value?.toString()?.length ?? 0} / {max}
                  </span>
                )}
            </div>
          ) : (
            <div className={bem("helperText")} />
          )}
          {maxLength !== undefined &&
            type !== "number" &&
            (hideCounter === undefined || hideCounter === false) && (
              <div className={bem("counter")}>
                <span>
                  ({value !== undefined ? (String(value)?.length ?? 0) : 0} /{" "}
                  {maxLength})
                </span>
              </div>
            )}
        </div>
      </div>
    )
  },
)

Input.displayName = "Input"
