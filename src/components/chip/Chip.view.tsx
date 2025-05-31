import { create } from "@/helpers/bem"
import { Icon } from "@/components/icon"
import styles from "./Chip.module.scss"

import type { ChipProps } from "./Chip.model"
import type { HTMLAttributes } from "react"

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
}: ChipProps & {
  buttonProps?: HTMLAttributes<HTMLButtonElement>
}) {
  return (
    <div
      {...rest}
      className={bem(undefined, {
        [variant]: true,
        "has-icon": typeof onDelete === "function",
        "is-clickable": typeof onClick === "function" || typeof onKeyDown === "function",
        [`${variant}--${color}`]: true,
      }, className)}
    >
      {icon}
      <span className={bem("label")}>{label}</span>
      {typeof onDelete === "function" && (
        <button
          aria-label="delete"
          className={bem("delete", {
            [color]: true,
          })}
          type="button"
          {...buttonProps}
        >
          <Icon name="Delete01Icon" />
        </button>
      )}
    </div>
  )
}
