import { type FC, type KeyboardEvent, useCallback, memo } from "react"

import { create } from "@/helpers/bem"

import styles from "./Chip.module.scss"

import type { ChipProps } from "./Chip.model"

const bem = create(styles, "Chip")

export const Chip: FC<ChipProps> = memo(
  ({
    label,
    icon,
    variant = "filled",
    color = "primary",
    className,
    onDelete,
    onClick,
    onKeyDown,
  }) => {
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onKeyDown?.(e)
        }
      },
      [onKeyDown],
    )

    const isClickable = !!onClick
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        aria-label={typeof label === "string" ? label : undefined}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : -1}
        className={bem(
          undefined,
          { [variant]: !!variant, [color]: !!color },
          className,
        )}
        onClick={e => isClickable && onClick?.(e)}
        onKeyDown={isClickable || onKeyDown ? handleKeyDown : undefined}
      >
        {icon}
        <span className={bem("label")}>{label}</span>
        {onDelete && (
          <button
            aria-label="delete"
            className={bem("delete")}
            type="button"
            onClick={e => {
              e.stopPropagation()
              onDelete(e)
            }}
          >
            &times; {/* Replace with an actual icon if needed */}
          </button>
        )}
      </div>
    )
  },
)

Chip.displayName = "Chip"
