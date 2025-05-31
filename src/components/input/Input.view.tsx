import { create } from "@/helpers/bem"
import { Label } from "@/components/label"
import styles from "./Input.module.scss"
import type { InputProps } from "./Input.model"
import type { HTMLInputTypeAttribute } from "react"

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
  minRows,
  maxRows,
  type = "text",
  ...rest
}: InputProps) {
  delete rest.onValidate
  delete rest.errorTranslations

  const isError = typeof errorText === "string"
  const hasValue = (value !== undefined && value !== "") || Boolean(placeholder)

  // for aria-describedby
  const errorId  = isError ? `${name}-error`  : undefined
  const helperId = !isError && helperText   ? `${name}-helper` : undefined
  const describedBy = [errorId, helperId].filter(Boolean).join(" ") || undefined
  return (
    <div className={bem(undefined, undefined, className)}>
      <div className={bem("inner")}>
        {typeof label === "string" && (
          <Label
            {...labelProps}
            htmlFor={name}
            label={label}
            required={required}
            error={isError}
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
            {multiline ? (
              <textarea
                {...rest}
                id={name}
                name={name}
                placeholder={placeholder}
                rows={rows}
                // you could enforce minRows/maxRows here via styles or JS
                aria-required={required}
                aria-invalid={isError}
                aria-describedby={describedBy}
                className={bem("input__node", { multiline: true }, inputClassName)}
              />
            ) : (
              <input
                {...rest}
                id={name}
                name={name}
                type={type as HTMLInputTypeAttribute}
                placeholder={placeholder}
                value={value ?? ""}
                aria-required={required}
                aria-invalid={isError}
                aria-describedby={describedBy}
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
      
      {(isError || helperText || typeof maxLength === "number") && (
        <div className={bem("footer")}>
          {(isError || helperText) && (
            <div
              id={errorId ?? helperId}
              role={isError ? "alert" : undefined}
              aria-live={isError ? "assertive" : "polite"}
              className={bem("helperText")}
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
