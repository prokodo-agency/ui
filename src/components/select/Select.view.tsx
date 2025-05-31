import { Fragment, type JSX } from "react"
import { create } from "@/helpers/bem"
import { Label } from "@/components/label"
import styles from "./Select.module.scss"
import type { SelectViewProps } from "./Select.model"

const bem = create(styles, "Select")

export function SelectView<Value extends string = string>({
  id,
  name = id,
  label,
  hideLabel,
  iconVisible,
  placeholder = "-- Please choose --",
  helperText,
  errorText,
  className,
  fieldClassName,
  labelProps,
  required,
  multiple,
  value,
  items,
  _clientState,
}: SelectViewProps<Value>): JSX.Element | null {
  /* guard – nothing to show */
  if (!items?.length) return null

  /* a11y helpers ------------------------------------------------------- */
  const isError   = Boolean(errorText)
  const hasHelper = Boolean(helperText)
  const listId    = `${id}-listbox`
  const errorId   = isError   ? `${id}-error`  : undefined
  const helperId  = hasHelper ? `${id}-helper` : undefined

  const open    = _clientState?.open ?? false;
  const btnRef  = _clientState?.buttonRef;
  const listRef = _clientState?.listRef;

  /* figure out the display label (server-side, no interaction yet) ----- */
  const selectedItems = Array.isArray(value)
    ? items.filter(i => value.includes(i.value as Value))
    : items.filter(i => i.value === (value as Value | undefined))
  const display =
    selectedItems.length === 0
      ? (
        <span className={bem("button__inner", { "is-placeholder": true, expanded: open })}>
          {placeholder}
        </span>
      )
      : (
        <span className={bem("button__inner", { expanded: open })}>
          {selectedItems.map((i, idx) => (
            <Fragment key={i?.label}>
              {iconVisible && i.icon?.()}
              {i.label}
              {idx < selectedItems.length - 1 && ", "}
            </Fragment>
          ))}
        </span>
      )

  return (
    <div className={bem(undefined, undefined, className)}>
      {/* ------------------------------------------------ label */}
      {!hideLabel && (
        <Label
          {...labelProps}
          htmlFor={id}
          label={label}
          required={required}
          error={isError}
          className={bem("label", undefined, labelProps?.className)}
        />
      )}

      {/* ------------------------------------------------ field */}
      <div className={bem("field", undefined, fieldClassName)}>
        {/* --- toggle button (static, closed) */}
        <button
          id={id}
          ref={btnRef}
          name={name}
          type="button"
          role="button"
          className={bem("button", { expanded: open })}
          onClick={_clientState?.onButtonClick}
          onKeyDown={_clientState?.onButtonKey}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-invalid={isError || undefined}
          aria-required={required || undefined}
          aria-describedby={errorId ?? helperId}
        >
          {display}
        </button>

        {/* --- listbox (static, hidden via CSS – client will unhide) */}
        <ul
          id={listId}
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          hidden={!open}
          className={bem("listbox", { "is-open": open, "is-closed": !open })}
        >
          {/* optional placeholder when the field is not required */}
          {!required && !multiple && (
            <li
              key="placeholder"
              role="option"
              aria-selected={selectedItems.length === 0}
              className={bem("item", { selected:selectedItems.length === 0 })}
              onClick={() => _clientState?.onOptionClick(null)}
            >
              {placeholder}
            </li>
          )}

          {/* actual options */}
          {items.map(opt => {
            const selected = Array.isArray(value)
              ? value.includes(opt.value as Value)
              : opt.value === value

            return (
              <li
                key={`${id}-${opt.value}`}
                role="option"
                aria-selected={selected}
                className={bem("item", { selected })}
                onClick={() => _clientState?.onOptionClick(opt.value)}
              >
                {multiple && (
                  <input
                    type="checkbox"
                    aria-hidden="true"
                    readOnly
                    defaultChecked={selected}
                    className={bem("checkbox", { checked:selected })}
                  />
                )}
                {iconVisible && opt.icon?.()}
                {opt.label}
              </li>
            )
          })}
        </ul>
      </div>

      {/* ------------------------------------------------ helper / error */}
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
    </div>
  )
}
