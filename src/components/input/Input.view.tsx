import { Label } from "@/components/label"
import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import styles from "./Input.module.scss"

import type { InputProps } from "./Input.model"
import type { JSX, HTMLInputTypeAttribute } from "react"

const bem = create(styles, "Input")

export function InputView({
  inputRef,
  name,
  label,
  disabled,
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
  hideCounter,
  rows,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  minRows,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  maxRows,
  type = "text",
  ...rest
}: InputProps): JSX.Element {
  delete rest?.onValidate
  delete rest?.errorTranslations
  delete rest?.customRegexPattern

  const isError = typeof errorText === "string"
  const hasValue = (value !== undefined && value !== "") || Boolean(placeholder)

  // for aria-describedby
  const hasHelperText = isString(helperText)
  const errorId = isError ? `${name}-error` : undefined
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
            className={bem(
              "label",
              {
                "is-focused": Boolean(isFocused) || hasValue,
              },
              labelProps.className,
            )}
          />
        )}

        <div className={bem("field", undefined, fieldClassName)}>
          <div
            className={bem(
              "input",
              {
                "is-focused": Boolean(isFocused),
                disabled: Boolean(disabled),
                multiline: Boolean(multiline),
                fullWidth: Boolean(fullWidth),
              },
              inputContainerClassName,
            )}
          >
            {Boolean(multiline) ? (
              <textarea
                {...rest}
                ref={inputRef as React.Ref<HTMLTextAreaElement>}
                aria-describedby={describedBy}
                aria-invalid={isError}
                aria-required={required}
                disabled={disabled}
                id={name}
                name={name}
                placeholder={placeholder}
                required={Boolean(required)}
                rows={rows}
                value={value ?? ""}
                className={bem(
                  "input__node",
                  { multiline: true },
                  inputClassName,
                )}
              />
            ) : (
              <input
                {...rest}
                ref={inputRef as React.Ref<HTMLInputElement>}
                aria-describedby={describedBy}
                aria-invalid={isError}
                aria-required={required}
                disabled={disabled}
                id={name}
                name={name}
                placeholder={placeholder}
                required={Boolean(required)}
                type={type as HTMLInputTypeAttribute}
                value={value ?? ""}
                className={bem(
                  "input__node",
                  { multiline: false },
                  inputClassName,
                )}
              />
            )}
          </div>
        </div>
      </div>

      {(isError || hasHelperText || typeof maxLength === "number") && (
        <div
          className={bem("footer", {
            "counter-only":
              !isError && !hasHelperText && typeof maxLength === "number",
          })}
        >
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
          {!Boolean(hideCounter) && typeof maxLength === "number" && (
            <div className={bem("counter")}>
              <span>
                {value != null ? String(value).length : 0} / {maxLength}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
