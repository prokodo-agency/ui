import { Label } from "@/components/label"
import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import styles from "./Input.module.scss"

import type { InputProps } from "./Input.model"
import type { JSX, HTMLInputTypeAttribute } from "react"

const bem = create(styles, "Input")

export function InputView({
  name,
  label,
  placeholder,
  isFocused,
  labelProps = {},
  value,
  helperText,
  errorText,
  required,
  fullWidth,
  multiline,
  maxLength,
  className,
  fieldClassName,
  inputContainerClassName,
  inputClassName,
  rows,
  // minRows,
  // maxRows,
  type = "text",
  ...rest
}: InputProps): JSX.Element {
  delete rest.onValidate
  delete rest.errorTranslations

  const isError = typeof errorText === "string"
  const hasValue = (value !== undefined && value !== "") || Boolean(placeholder)

  // for aria-describedby
  const hasHelperText = isString(helperText)
  const errorId  = isError ? `${name}-error`  : undefined
  const helperId = !isError && hasHelperText ? `${name}-helper` : undefined
  const describedBy = [errorId, helperId].filter(Boolean).join(" ") || undefined
  return (
    <div className={bem(undefined, undefined, className)}>
      <div className={bem("inner")}>
        {typeof label === "string" && (
          <Label
            {...labelProps}
            error={isError}
            htmlFor={name}
            label={label}
            required={required}
            className={bem("label", {
              "is-focused": Boolean(isFocused) || hasValue,
            }, labelProps.className)}
          />
        )}

        <div className={bem("field", undefined, fieldClassName)}>
          <div className={bem("input", {
            "is-focused": Boolean(isFocused),
            multiline: Boolean(multiline),
            fullWidth: Boolean(fullWidth),
          }, inputContainerClassName)}>
            {Boolean(multiline) ? (
              <textarea
                {...rest}
                // Enforce minRows/maxRows here via styles or JS
                aria-describedby={describedBy}
                aria-invalid={isError}
                aria-required={required}
                className={bem("input__node", { multiline: true }, inputClassName)}
                id={name}
                name={name}
                placeholder={placeholder}
                rows={rows}
              />
            ) : (
              <input
                {...rest}
                aria-describedby={describedBy}
                aria-invalid={isError}
                aria-required={required}
                id={name}
                name={name}
                placeholder={placeholder}
                type={type as HTMLInputTypeAttribute}
                value={value ?? ""}
                className={bem(
                  "input__node",
                  { multiline: false },
                  inputClassName
                )}
              />
            )}
          </div>
        </div>
      </div>

      {(isError || hasHelperText || typeof maxLength === "number") && (
        <div className={bem("footer")}>
          {(isError || hasHelperText) && (
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
          {typeof maxLength === "number" && (
            <div className={bem("counter")}>
              <span>
                {(value != null ? String(value).length : 0)} / {maxLength}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
