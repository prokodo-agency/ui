import { Slider as MUISlider } from "@mui/base/Slider"
import {
  type FC,
  type FocusEvent,
  memo,
  useEffect,
  useCallback,
  useState,
} from "react"

import { create } from "@/helpers/bem"

import { Label } from "../label"

import styles from "./Slider.module.scss"

import type { SliderProps } from "./Slider.model"

const bem = create(styles, "Slider")

export const Slider: FC<SliderProps> = memo(
  ({
    id,
    className,
    required,
    value,
    label,
    labelProps,
    valueLabelProps,
    disabled,
    onFocus,
    onBlur,
    onChange,
    ...props
  }) => {
    const [Value, setValue] = useState<number | number[] | undefined>(
      Number(value) ?? 0,
    )
    const [focused, setFocused] = useState(false)
    const handleChangeFocus = useCallback(
      (e: FocusEvent<HTMLSpanElement>) => {
        setFocused(!focused)
        !focused ? onFocus?.(e) : onBlur?.(e)
      },
      [focused, onFocus, onBlur],
    )

    useEffect(() => {
      if (value !== undefined) {
        setValue(Number(value))
      }
    }, [value])

    const handleSliderChange = useCallback(
      (e: Event, newValue: number | number[], activeThumb: number) => {
        setValue(newValue)
        onChange?.(e, newValue, activeThumb)
      },
      [onChange],
    )

    return (
      <div className={bem(undefined, undefined, className)}>
        <Label
          {...labelProps}
          className={bem("label")}
          htmlFor={id}
          label={label}
          required={required}
        />
        <MUISlider
          marks
          aria-label={label}
          id={id}
          {...props}
          disabled={disabled}
          value={Value}
          slotProps={{
            root: {
              className: bem("root", {
                disabled: Boolean(disabled),
              }),
            },
            rail: {
              className: bem("rail"),
            },
            track: {
              className: bem("track"),
            },
            thumb: {
              className: bem("thumb", {
                focused,
              }),
            },
            mark: {
              className: bem("mark"),
            },
            markLabel: {
              className: bem("mark__label"),
            },
          }}
          slots={{
            valueLabel: ({ children }) => (
              <span
                {...valueLabelProps}
                className={bem("valueText", undefined, labelProps?.className)}
              >
                {children}
              </span>
            ),
          }}
          onBlur={handleChangeFocus}
          onChange={handleSliderChange}
          onFocus={handleChangeFocus}
        />
      </div>
    )
  },
)

Slider.displayName = "Slider"
