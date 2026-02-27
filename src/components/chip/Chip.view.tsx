import { Icon } from "@/components/icon"
import { create } from "@/helpers/bem"

import styles from "./Chip.module.scss"

import type { ChipViewProps } from "./Chip.model"
import type { JSX, HTMLAttributes } from "react"

const bem = create(styles, "Chip")

export function ChipView({
  buttonProps,
  label,
  icon,
  variant = "filled",
  color = "primary",
  className,
  onClick,
  onKeyDown,
  onDelete,
  ...rest
}: ChipViewProps & {
  buttonProps?: HTMLAttributes<HTMLButtonElement>
}): JSX.Element {
  const isClickable =
    typeof onClick === "function" || typeof onKeyDown === "function"
  return (
    <div
      {...rest}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={bem(
        undefined,
        {
          [variant]: true,
          "has-icon": typeof onDelete === "function",
          "is-clickable": isClickable,
          [`${variant}--${color}`]: true,
        },
        className,
      )}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {icon}
      <span className={bem("label")}>{label}</span>
      {typeof onDelete === "function" && (
        <button
          aria-label="delete"
          type="button"
          className={bem("delete", {
            [color]: true,
          })}
          onClick={e => {
            e.stopPropagation()
            onDelete(e)
          }}
          {...buttonProps}
        >
          <Icon color="error" name="Delete01Icon" />
        </button>
      )}
    </div>
  )
}
