import { Fragment, type JSX } from "react"

import { Label } from "@/components/label"
import { create } from "@/helpers/bem"

import styles from "./Select.module.scss"

import type { SelectViewProps } from "./Select.model"

const bem = create(styles, "Select")

export function SelectView<Value extends string = string>({
  id,
  disabled,
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

  const open    = Boolean(_clientState?.open) ?? false;
  const btnRef  = _clientState?.buttonRef;
  const listRef = _clientState?.listRef;

  /* figure out the display label (server-side, no interaction yet) ----- */
  const selectedItems = Array.isArray(value)
    ? items.filter(i => value.includes(i.value as Value))
    : items.filter(i => i.value === (value as Value | undefined))
  const display =
    selectedItems.length === 0
      ? (
        <span className={bem("button__inner", {
          "is-placeholder": true,
          "is-placeholder--disabled": Boolean(disabled),
          expanded: open,
        })}>
          {placeholder}
        </span>
      )
      : (
        <span className={bem("button__inner", { expanded: open })}>
          {selectedItems.map((i, idx) => (
            <Fragment key={i?.label}>
              {Boolean(iconVisible) && i.icon?.()}
              {i.label}
              {idx < selectedItems.length - 1 && ", "}
            </Fragment>
          ))}
        </span>
      )

  return (
    <div className={bem(undefined, undefined, className)}>
      {/* ------------------------------------------------ label */}
      {!Boolean(hideLabel) && (
        <Label
          {...labelProps}
          className={bem("label", undefined, labelProps?.className)}
          error={isError}
          htmlFor={id}
          label={label}
          required={required}
        />
      )}

      {/* ------------------------------------------------ field */}
      <div className={bem("field", undefined, fieldClassName)}>
        {/* --- toggle button (static, closed) */}
        <button
          ref={btnRef}
          aria-controls={listId}
          aria-describedby={errorId ?? helperId}
          aria-expanded={open}
          aria-haspopup="listbox"
          className={bem("button", { expanded: open })}
          disabled={disabled}
          id={id}
          name={name}
          type="button"
          onClick={_clientState?.onButtonClick}
          onKeyDown={_clientState?.onButtonKey}
        >
          {display}
        </button>

        {/* --- listbox (static, hidden via CSS – client will unhide) */}
        <ul
          ref={listRef}
          className={bem("listbox", { "is-open": open, "is-closed": !open })}
          hidden={!open}
          id={listId}
          role="listbox"
          tabIndex={-1}
        >
          {/* optional placeholder when the field is not required */}
          {!Boolean(required) && !Boolean(multiple) && (
            <li
              key="placeholder"
              aria-selected={selectedItems.length === 0}
              className={bem("item", { selected:selectedItems.length === 0 })}
              role="option"
              onClick={() => _clientState?.onOptionClick(null)}
              onKeyDown={() => _clientState?.onOptionClick(null)}
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
                aria-selected={selected}
                className={bem("item", { selected })}
                role="option"
                onClick={() => _clientState?.onOptionClick(opt.value)}
                onKeyDown={() => _clientState?.onOptionClick(opt.value)}
              >
                {Boolean(multiple) && (
                  <input
                    readOnly
                    aria-hidden="true"
                    className={bem("checkbox", { checked:selected })}
                    defaultChecked={selected}
                    type="checkbox"
                  />
                )}
                {Boolean(iconVisible) && opt.icon?.()}
                {opt.label}
              </li>
            )
          })}
        </ul>
      </div>

      {/* ------------------------------------------------ helper / error */}
      {(isError || Boolean(helperText)) && (
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
  )
}
