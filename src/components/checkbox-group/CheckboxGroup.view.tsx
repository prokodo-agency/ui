import { Checkbox } from "@/components/checkbox"
import { create } from "@/helpers/bem"

import styles from "./CheckboxGroup.module.scss"

import type { CheckboxGroupViewProps } from "./CheckboxGroup.model"
import type { JSX } from "react"

const bem = create(styles, "CheckboxGroup")

export function CheckboxGroupView<T extends string>({
  ariaLabel,
  legend,
  hideLegend,
  legendProps,
  name,
  disabled,
  required,
  options,
  selectedValues,
  hiddenInputName,
  layout = "stack",
  variant = "plain",
  translations: t,
  isChecked,
  onToggle,
}: CheckboxGroupViewProps<T>): JSX.Element | null {
  if (!options?.length) return null

  const label = ariaLabel ?? t?.ariaLabel ?? "Options"
  const isGroupRequiredActive = Boolean(required) && selectedValues.length === 0

  return (
    <fieldset
      aria-label={label}
      aria-required={required || undefined}
      className={bem()}
    >
      {legend ? (
        <legend
          {...legendProps}
          className={bem(
            "legend",
            {
              "is-hidden": Boolean(hideLegend),
            },
            legendProps?.className,
          )}
        >
          <span className={bem("legendLabel")}>{legend}</span>
          {required ? (
            <span aria-hidden="true" className={bem("legendRequiredMark")}>
              *
            </span>
          ) : null}
        </legend>
      ) : null}

      {hiddenInputName ? (
        <input
          name={hiddenInputName}
          type="hidden"
          value={selectedValues.join(",")}
        />
      ) : null}

      <div className={bem("list", { [layout]: true, [variant]: true })}>
        {options.map(opt => {
          const checked = isChecked(opt.value)
          const itemDisabled = Boolean(disabled) || Boolean(opt.disabled)

          return (
            <div
              key={opt.value}
              className={bem("item", {
                disabled: itemDisabled,
              })}
            >
              <Checkbox
                checked={checked}
                description={opt.description}
                disabled={itemDisabled}
                icon={opt.icon}
                iconLabel={opt.iconLabel}
                name={name}
                required={Boolean(opt.required) || isGroupRequiredActive}
                showRequiredMark={Boolean(opt.required)}
                title={opt.title}
                value={opt.value}
                variant={variant}
                onChange={() => onToggle?.(opt.value)}
              />
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}
