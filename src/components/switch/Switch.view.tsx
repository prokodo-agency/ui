import { Icon, type IconName } from "@/components/icon"
import { Label } from "@/components/label"
import { create } from "@/helpers/bem"

import styles from "./Switch.module.scss"

import type { SwitchViewProps } from "./Switch.model"
import type { FC } from "react"

const bem = create(styles, "Switch")

export const SwitchView: FC<SwitchViewProps> = ({
  name,
  label,
  labelProps = {},
  required = false,
  variant = "primary",
  icon,
  checkedIcon,
  isChecked,
  disabled = false,
  hideLabel = false,
  className,
  onChangeInternal,
  onFocusInternal,
  onBlurInternal,
  ...props
}) => {
  const hasLabel = typeof label === "string" && label.length > 0

  return (
    <div className={bem(undefined, { [variant]: true }, className)}>
      {hasLabel && (
        <Label
          {...labelProps}
          htmlFor={name}
          label={label}
          required={required}
          className={bem(
            "label",
            undefined,
            hideLabel ? "visually-hidden" : undefined,
          )}
        />
      )}

      <div
        className={bem("control", {
          checked: isChecked,
          disabled: Boolean(disabled),
        })}
      >
        {/* Track‐Layer */}
        <div
          className={bem("track", {
            checked: isChecked,
            disabled: Boolean(disabled),
          })}
        />

        <input
          {...props}
          aria-checked={isChecked}
          aria-disabled={disabled || undefined}
          aria-required={required || undefined}
          checked={isChecked}
          disabled={disabled}
          id={name}
          name={name}
          role="switch"
          type="checkbox"
          {...(hasLabel && !hideLabel
            ? { "aria-labelledby": `${name}-label-text` }
            : { "aria-label": label })}
          className={bem("input")}
          onBlur={onBlurInternal}
          onChange={onChangeInternal}
          onFocus={onFocusInternal}
        />

        <div
          className={bem("thumb", {
            checked: isChecked,
            disabled: Boolean(disabled),
          })}
        >
          {(icon || checkedIcon) && (
            <span className={bem("icon__wrapper")}>
              <Icon
                className={bem("icon", { isActive: isChecked })}
                name={(isChecked ? checkedIcon : icon) as IconName}
                size="sm"
              />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
