import { create } from "@/helpers/bem"
import { Label } from "@/components/label"
import { Icon, type IconName } from "@/components/icon"
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
            hideLabel ? "visually-hidden" : undefined
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
          id={name}
          name={name}
          type="checkbox"
          role="switch"
          checked={isChecked}
          disabled={disabled}
          aria-checked={isChecked}
          aria-disabled={disabled || undefined}
          aria-required={required || undefined}
          {...(hasLabel && !hideLabel
            ? { "aria-labelledby": `${name}-label-text` }
            : { "aria-label": label })}
          className={bem("input")}
          onChange={onChangeInternal}
          onFocus={onFocusInternal}
          onBlur={onBlurInternal}
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
                name={(isChecked ? checkedIcon : icon) as IconName}
                size="sm"
                className={bem("icon", { isActive: isChecked })}
              />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
