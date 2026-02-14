import { create } from "@/helpers/bem"
import { isArray, isNumber } from "@/helpers/validations"

import { Input } from "../input"
import { Loading } from "../loading"

import styles from "./Autocomplete.module.scss"

import type { AutocompleteViewProps } from "./Autocomplete.model"
import type { JSX } from "react"

const bem = create(styles, "Autocomplete")

export function AutocompleteView({
  id,
  name,
  label,
  placeholder,
  required,
  disabled,
  fullWidth,
  readOnly,
  autoComplete,
  "aria-describedby": ariaDescribedBy,
  "aria-labelledby": ariaLabelledBy,
  value,
  items,
  loading,
  loadingText,
  emptyText,
  minQueryLength = 2,
  minQueryLengthText,
  className,
  inputClassName,
  listClassName,
  itemClassName,
  inputProps,
  _clientState,
  onChange,
  onSelect,
}: AutocompleteViewProps): JSX.Element {
  void onChange
  void onSelect

  const { hideLabel, ...restInputProps } = inputProps ?? {}

  const hasItems = isArray(items) && items.length > 0
  const canShowList = Boolean(_clientState?.open)
  const canSearch = String(value ?? "").trim().length >= minQueryLength

  return (
    <div className={bem(undefined, undefined, className)}>
      <div className={bem("inputWrap")}>
        <Input
          {...restInputProps}
          aria-describedby={ariaDescribedBy}
          aria-labelledby={ariaLabelledBy}
          autoComplete={autoComplete}
          disabled={disabled}
          fullWidth={fullWidth}
          hideLegend={hideLabel || restInputProps?.hideLegend}
          id={id}
          label={label}
          name={name}
          placeholder={placeholder}
          readOnly={readOnly}
          required={required}
          value={value}
          className={bem(
            "input",
            {
              "is-open": canShowList,
            },
            inputClassName,
          )}
          inputClassName={bem(
            "input__node",
            {
              "is-open": canShowList,
            },
            restInputProps?.inputClassName,
          )}
          inputContainerClassName={bem(
            "input__inner",
            {
              "is-open": canShowList,
            },
            restInputProps?.inputContainerClassName,
          )}
          onKeyDown={_clientState?.onInputKeyDown}
          onChange={event => {
            _clientState?.onInputChange(event?.target?.value ?? "")
          }}
          onFocus={() => {
            _clientState?.onInputFocus()
          }}
        />
      </div>

      {canShowList && (
        <ul
          className={bem("list", undefined, listClassName)}
          role="listbox"
          tabIndex={-1}
          style={{
            top: isNumber(_clientState?.listTop)
              ? `${_clientState.listTop}px`
              : undefined,
          }}
        >
          {Boolean(loading) ? (
            <li>
              <p className={bem("state")}>
                <Loading size="sm" />
                {loadingText}
              </p>
            </li>
          ) : !canSearch ? (
            <li>
              <p className={bem("state")}>
                {isNumber(minQueryLength)
                  ? (
                      minQueryLengthText ?? "{count} characters required"
                    ).replaceAll("{count}", String(minQueryLength))
                  : "Type to search"}
              </p>
            </li>
          ) : !hasItems ? (
            <li>
              <p className={bem("state")}>{emptyText}</p>
            </li>
          ) : (
            items?.map((item, index) => (
              <li
                key={item.value}
                aria-selected={_clientState?.activeIndex === index}
                className={bem("itemRow")}
                role="option"
              >
                <button
                  type="button"
                  className={bem(
                    "item",
                    {
                      "is-active": _clientState?.activeIndex === index,
                      "is-first": index === 0,
                      "is-last": index === items.length - 1,
                    },
                    itemClassName,
                  )}
                  onMouseDown={event => {
                    event.preventDefault()
                    _clientState?.onSelectItem(item)
                  }}
                >
                  <p className={bem("itemLabel")}>{item.label}</p>
                  {item.description ? (
                    <p className={bem("itemDescription")}>{item.description}</p>
                  ) : null}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
