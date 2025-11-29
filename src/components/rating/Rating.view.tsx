import { Icon } from "@/components/icon"
import { Label } from "@/components/label"
import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import styles from "./Rating.module.scss"

import type { RatingViewProps } from "./Rating.model"
import type { Ref, JSX } from "react"

const bem = create(styles, "Rating")

export function RatingView(props: RatingViewProps): JSX.Element {
  const {
    name,
    label,
    labelProps = {},
    disabled,
    readOnly,
    isFocused,
    required,
    fullWidth,
    helperText,
    errorText,
    className,
    fieldClassName,
    groupClassName,
    iconClassName,
    hideLegend,
    value,
    hoverValue,
    max = 5,
    min = 1,
    onClick,
    onMouseEnter,
    onMouseLeave,
    inputRef,
  } = props

  const isError = typeof errorText === "string"

  const hasHelperText = isString(helperText)
  const errorId = isError ? `${name}-error` : undefined
  const helperId = !isError && hasHelperText ? `${name}-helper` : undefined
  const describedBy = [errorId, helperId].filter(Boolean).join(" ") || undefined

  const current = hoverValue ?? value ?? null
  const maxSafe = max && max > 0 ? max : 5
  const minSafe = min && min > 0 ? min : 1

  return (
    <div
      className={bem(
        undefined,
        { "full-width": Boolean(fullWidth) },
        className,
      )}
    >
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
                "is-focused": Boolean(isFocused) || current !== null,
              },
              labelProps.className,
            )}
          />
        )}

        <div className={bem("field", undefined, fieldClassName)}>
          <div
            aria-describedby={describedBy}
            aria-disabled={disabled}
            aria-invalid={isError}
            aria-required={required}
            className={bem("group", undefined, groupClassName)}
            role="radiogroup"
          >
            {Array.from({ length: maxSafe }, (_, idx) => {
              const itemValue = idx + 1
              const filled = current != null && itemValue <= (current as number)
              const isSelected =
                value != null && itemValue === (value as number)
              return (
                <button
                  key={itemValue}
                  aria-checked={isSelected}
                  aria-label={`${itemValue} ${itemValue === 1 ? "star" : "stars"}`}
                  data-value={itemValue}
                  disabled={disabled}
                  role="radio"
                  type="button"
                  className={bem(
                    "icon",
                    {
                      filled,
                      disabled: Boolean(disabled),
                      readonly: Boolean(readOnly),
                      selected: isSelected,
                    },
                    iconClassName,
                  )}
                  onClick={onClick}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                >
                  <Icon
                    aria-hidden="true"
                    className={bem("icon__symbol")}
                    name="StarIcon"
                    size="md"
                  />
                  {!Boolean(hideLegend) && (
                    <span className={bem("icon__sr-only")}>
                      {itemValue >= minSafe
                        ? `${itemValue} / ${maxSafe}`
                        : itemValue}
                    </span>
                  )}
                </button>
              )
            })}

            {/* Hidden input so it behaves in classic HTML forms */}
            <input
              ref={inputRef as Ref<HTMLInputElement>}
              readOnly
              id={name}
              max={maxSafe}
              min={minSafe}
              name={name}
              type="hidden"
              value={value ?? ""}
            />
          </div>
        </div>
      </div>

      {(isError || hasHelperText) && (
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
        </div>
      )}
    </div>
  )
}
