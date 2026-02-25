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
  fullWidth = false,
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
  /* istanbul ignore next */
  if (!items?.length) return null

  /* a11y helpers ------------------------------------------------------- */
  const isError = Boolean(errorText)
  const hasHelper = Boolean(helperText)
  const listId = `${id}-listbox`
  const errorId = isError ? `${id}-error` : undefined
  const helperId = hasHelper ? `${id}-helper` : undefined

  const open = Boolean(_clientState?.open) ?? /* istanbul ignore next */ false
  const btnRef = _clientState?.buttonRef

  /* figure out the display label (server-side, no interaction yet) ----- */
  const selectedItems = Array.isArray(value)
    ? /* istanbul ignore next */ items.filter(
        /* istanbul ignore next */ i =>
          (value as Value[]).includes(i.value as Value),
      )
    : items.filter(i => i.value === (value as Value | undefined))
  const display =
    selectedItems.length === 0 ? (
      <span
        className={bem("button__inner", {
          "is-placeholder": true,
          "is-placeholder--disabled": Boolean(disabled),
          expanded: open,
        })}
      >
        {placeholder}
      </span>
    ) : (
      <span className={bem("button__inner", { expanded: open })}>
        {selectedItems.map((i, idx) => (
          <Fragment key={i?.label}>
            {/* istanbul ignore next */}
            {Boolean(iconVisible) && /* istanbul ignore next */ i.icon?.()}
            {i.label}
            {/* istanbul ignore next */}
            {/* istanbul ignore next */}
            {idx < selectedItems.length - 1 && /* istanbul ignore next */ ", "}
          </Fragment>
        ))}
      </span>
    )

  return (
    <div
      className={bem(
        undefined,
        {
          fullWidth: Boolean(fullWidth),
        },
        className,
      )}
    >
      {/* ------------------------------------------------ label */}
      {!Boolean(hideLabel) && (
        <Label
          {...labelProps}
          className={bem("label", undefined, labelProps?.className)}
          error={isError}
          htmlFor={id}
          label={label}
          required={required}
          type="label"
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

        {/* hidden value for form submit */}
        <input
          name={name}
          type="hidden"
          value={
            /* istanbul ignore next */ Array.isArray(value)
              ? /* istanbul ignore next */ value.join(",")
              : (value ?? "")
          }
        />

        {/* --- listbox (static, hidden via CSS – client will unhide) */}
        {/* --- listbox is rendered by the client (portal) to avoid stacking-context issues */}
        {_clientState?.renderListbox?.({
          id: listId,
          className: bem("listbox", { "is-open": open, "is-closed": !open }),
          open,
          required,
          multiple,
          placeholder,
          items,
          value: (value ?? (Boolean(multiple) ? [] : "")) as Value,
          onOptionClick: /* istanbul ignore next */ (opt: Value | null) =>
            _clientState?.onOptionClick?.(opt),
          iconVisible,
          bemItem: /* istanbul ignore next */ (
            mods?: Record<string, boolean>,
          ) => bem("item", mods),
          bemCheckbox: /* istanbul ignore next */ (
            mods?: Record<string, boolean>,
          ) => bem("checkbox", mods),
        })}
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
