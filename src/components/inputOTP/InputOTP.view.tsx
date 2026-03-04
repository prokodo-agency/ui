import { Label } from "@/components/label"
import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import { Input } from "../input"

import styles from "./InputOTP.module.scss"

import type { InputOTPViewProps } from "./InputOTP.model"
import type { JSX } from "react"

const bem = create(styles, "InputOTP")

export function InputOTPView({
  className,
  groupLabel,
  groupInstruction,
  label,
  labelProps = {},
  helperText,
  errorText,
  name = "otp",
  length = 6,
  otp,
  color = "primary",
  disabled,
  required,
  getInputRef,
  onDigitFocus,
  onDigitChange,
  onDigitKeyDown,
  onGroupPaste,
  ...props
}: InputOTPViewProps): JSX.Element {
  const isError = typeof errorText === "string"
  const hasHelperText = isString(helperText)
  const labelId = `${name}-label`
  const errorId = isError ? `${name}-error` : undefined
  const helperId = !isError && hasHelperText ? `${name}-helper` : undefined
  const describedBy =
    [`${name}-instructions`, errorId, helperId].filter(Boolean).join(" ") ||
    /* istanbul ignore next */
    undefined

  return (
    <div
      aria-describedby={describedBy}
      aria-disabled={disabled || undefined}
      aria-labelledby={label ? labelId : `${name}-group-label`}
      role="group"
      className={bem(
        undefined,
        { [color]: true, disabled: !!disabled, required: !!required },
        className,
      )}
      onPaste={onGroupPaste}
    >
      {/* Visually-hidden fallback label for when no visible `label` prop is given */}
      <span className={bem("label")} id={`${name}-group-label`}>
        {groupLabel ?? "Enter your OTP"}
      </span>
      <span className={bem("instruction")} id={`${name}-instructions`}>
        {groupInstruction ?? "Use the arrow keys to navigate between digits."}
      </span>

      {/* Visible label */}
      {typeof label === "string" && (
        <Label
          {...labelProps}
          className={bem("visible-label", undefined, labelProps.className)}
          color={color}
          error={isError}
          htmlFor={`${name}-0`}
          id={labelId}
          label={label}
          required={required}
        />
      )}

      {/* Digit cells row */}
      <div className={bem("row")}>
        {Array.from({ length }, (_, index) => (
          <Input
            key={`${name}-${index}`}
            {...props}
            hideCounter
            aria-label={`${props?.["aria-label"] ?? "OTP digit"} ${index + 1}`}
            autoComplete="one-time-code"
            className={bem("input")}
            color={color}
            disabled={disabled}
            fieldClassName={bem("field")}
            inputClassName={bem("input__node")}
            inputContainerClassName={bem("input__container")}
            inputMode="numeric"
            inputRef={getInputRef(index)}
            maxLength={1}
            name={`${name}-${index}`}
            pattern="\\d*"
            placeholder="•"
            type="text"
            value={otp[index] ?? ""}
            onChange={e => onDigitChange(e as never, index)}
            onFocus={() => onDigitFocus(index)}
            onKeyDown={e => onDigitKeyDown(e as never, index)}
          />
        ))}
      </div>

      {/* Footer: error message or helper text */}
      {(isError || hasHelperText) && (
        <div className={bem("footer")}>
          <div
            aria-live={isError ? "assertive" : "polite"}
            className={bem("helperText")}
            id={errorId ?? helperId}
            role={isError ? "alert" : undefined}
          >
            <span
              className={bem("helperText__content", { "is-error": isError })}
            >
              {errorText ?? helperText}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
