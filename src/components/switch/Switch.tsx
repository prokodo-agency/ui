"use client"

import { Switch as MUISwitch } from "@mui/base/Switch"
import { useState, type FC, type ChangeEvent, useCallback } from "react"

import { create } from "@/helpers/bem"

import { Icon, type IconName } from "../icon"
import { Label } from "../label"

import styles from "./Switch.module.scss"

import type { SwitchProps } from "./Switch.model"

const bem = create(styles, "Switch")

export const Switch: FC<SwitchProps> = ({
  variant = "primary",
  required,
  name,
  label,
  labelProps,
  icon,
  checked,
  disabled,
  checkedIcon,
  className,
  onChange,
  ...props
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked ?? false)

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked
      setIsChecked(newChecked)

      if (onChange) onChange(event, newChecked)
    },
    [onChange],
  )

  const renderIcon = useCallback(
    (name?: IconName, isActive?: boolean) => (
      <span aria-hidden="true" className={bem("icon__wrapper")}>
        <Icon
          className={bem("icon", { isActive: Boolean(isActive) })}
          name={name}
          size="sm"
        />
      </span>
    ),
    [],
  )

  return (
    <div className={bem(undefined, { [variant]: true }, className)}>
      <Label
        {...labelProps}
        className={bem("label")}
        htmlFor={name}
        label={label}
        required={required}
        contentProps={{
          className: bem("label__content"),
        }}
        textProps={{
          "aria-hidden": "true",
        }}
      >
        <MUISwitch
          aria-checked={isChecked}
          aria-disabled={disabled}
          aria-labelledby={`${name}-label-text`}
          aria-required={required ? "true" : undefined}
          checked={isChecked}
          disabled={disabled}
          id={name}
          role="switch"
          {...props}
          className={bem("control", {
            checked: isChecked,
            disabled: Boolean(disabled),
          })}
          slotProps={{
            track: {
              className: bem("track"),
            },
            thumb: {
              className: bem("thumb"),
            },
            input: {
              className: bem("input"),
              "aria-hidden": true,
            },
          }}
          onChange={handleChange}
        />
        {icon && checkedIcon && (
          <div
            aria-hidden="true"
            className={bem("icon__container", {
              checked: isChecked,
            })}
          >
            {isChecked
              ? renderIcon(checkedIcon, isChecked)
              : renderIcon(icon, isChecked)}
          </div>
        )}
      </Label>
    </div>
  )
}

Switch.displayName = "Switch"
