import { Icon } from "@/components/icon"
import { create } from "@/helpers/bem"

import styles from "./Checkbox.module.scss"

import type { CheckboxViewProps } from "./Checkbox.model"
import type { JSX } from "react"

const bem = create(styles, "Checkbox")

export function CheckboxView<T extends string = string>({
  className,
  name,
  value,
  title,
  description,
  icon,
  iconLabel,
  required,
  showRequiredMark,
  disabled,
  variant = "plain",
  isChecked,
  onChangeInternal,
}: CheckboxViewProps<T>): JSX.Element {
  const shouldShowRequiredMark = showRequiredMark ?? Boolean(required)

  return (
    <label
      className={bem(
        undefined,
        {
          checked: isChecked,
          disabled: Boolean(disabled),
          [variant]: true,
        },
        className,
      )}
    >
      <span className={bem("left")}>
        <input
          aria-checked={isChecked}
          checked={isChecked}
          className={bem("input")}
          disabled={disabled}
          name={name}
          readOnly={typeof onChangeInternal !== "function"}
          required={required}
          type="checkbox"
          value={value}
          onChange={onChangeInternal}
        />
        <span
          aria-hidden="true"
          className={bem("control", {
            checked: isChecked,
            [variant]: true,
          })}
        />
      </span>

      <span className={bem("body")}>
        <span className={bem("row")}>
          <span className={bem("title")}>{title}</span>
          {shouldShowRequiredMark ? (
            <span aria-hidden="true" className={bem("requiredMark")}>
              *
            </span>
          ) : null}
        </span>

        {description ? (
          <span className={bem("desc")}>{description}</span>
        ) : null}
      </span>

      <span className={bem("right")}>
        {icon?.name ? (
          <Icon
            {...icon}
            className={bem("rightIcon", undefined, icon.className)}
            label={iconLabel ?? undefined}
          />
        ) : null}
      </span>
    </label>
  )
}
