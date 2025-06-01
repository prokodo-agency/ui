import { Label } from "@/components/label"
import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import styles from "./Slider.module.scss"

import type { SliderViewProps, SliderMark } from "./Slider.model"
import type { FC } from "react"

const bem = create(styles, "Slider")

export const SliderView: FC<SliderViewProps> = ({
  id,
  label,
  hideLabel,
  labelProps = {},
  required,
  disabled,

  // Defaultwerte für min, max, step:
  min = 0,
  max = 100,
  step = 1,

  marks = false,
  valueLabelProps = {},
  className,

  internalValue,
  isFocused,
  onFocusInternal,
  onBlurInternal,
  onChangeInternal,
}) => {
  // Prozentwert (0–100) einfach berechnen, ohne Hook:
  const clamped = internalValue < min ? min : internalValue > max ? max : internalValue
  const pct = max > min ? ((clamped - min) / (max - min)) * 100 : 0

  // Markierungen berechnen (ebenfalls direkt):
  let markPoints: SliderMark[] = []
  if (Array.isArray(marks)) {
    markPoints = marks
  } else if (marks === true) {
    const pts: SliderMark[] = []
    // Bei Schrittweite step Achte darauf, dass step > 0 ist
    if (step > 0) {
      for (let v = min; v <= max; v += step) {
        pts.push({ value: v })
      }
      // Sicherstellen, dass das letzte Element exakt bei max endet:
      if (pts.length === 0 || pts?.[pts?.length - 1]?.value !== max) {
        pts.push({ value: max })
      }
    }
    markPoints = pts
  }

  return (
    <div className={bem(undefined, undefined, className)}>
      {/* Optionales Label */}
      {isString(label) && (
        <Label
          {...labelProps}
          htmlFor={id}
          label={label}
          required={required}
          className={bem("label", {
            "is-hidden": Boolean(hideLabel),
          })}
        />
      )}

      {/*
        Root-Container braucht eine feste Höhe (z.B. 30px), siehe SCSS.
        Darin liegt alles positioniert.
      */}
      <div className={bem("root", { disabled: Boolean(disabled) })}>
        {/* 1) Rail (unbefüllter Hintergrund) */}
        <div className={bem("rail")} />

        {/* 2) Track (bis zum aktuellen Wert) */}
        <div
          className={bem("track")}
          style={{ width: `${pct}%` }}
        />

        {/* 3) Tick Marks */}
        {markPoints.map((m) => {
          // Linker Offset in Prozent
          const leftPct =
            max > min
              ? ((m.value < min ? min : m.value > max ? max : m.value) - min) /
                (max - min) *
                100
              : 0

          return (
            <div
              key={m.value}
              aria-hidden="true"
              className={bem("mark")}
              style={{ left: `${leftPct}%` }}
            >
              {typeof m.label === "string" ? (
                <span className={bem("mark__label")}>{m.label}</span>
              ) : null}
            </div>
          )
        })}

        {/* 4) Native <input type="range">, transparent, liegt oben */}
        <input
          aria-disabled={Boolean(disabled) || undefined}
          aria-label={label}
          aria-valuemax={max}
          aria-valuemin={min}
          aria-valuenow={internalValue}
          aria-valuetext={String(internalValue)}
          className={bem("input")}
          disabled={disabled}
          id={id}
          max={max}
          min={min}
          step={step}
          type="range"
          value={internalValue}
          onBlur={onBlurInternal}
          onChange={onChangeInternal}
          onFocus={onFocusInternal}
        />

        {/* 5) Floating Value Label (Tooltip) über dem Thumb */}
        {!Boolean(disabled) && (
          <span
            {...valueLabelProps}
            className={bem("valueText", { focused: isFocused })}
            style={{
              left: `${pct}%`,
              transform: "translateX(-50%)",
            }}
          >
            {internalValue}
          </span>
        )}

        {/* 6) Custom Thumb (Kreis) */}
        <div
          className={bem("thumb", { focused: isFocused })}
          style={{
            left: `${pct}%`,
          }}
        />
      </div>
    </div>
  )
}
