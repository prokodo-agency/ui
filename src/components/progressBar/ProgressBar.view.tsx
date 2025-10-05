import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import styles from "./ProgressBar.module.scss"

import type { ProgressBarViewProps } from "./ProgressBar.model"
import type { JSX } from "react"

const bem = create(styles, "ProgressBar")

export function ProgressBarView({
  id,
  value,
  label,
  hideLabel,
  infinity,
  variant = "primary",
  animated = true,
  className,
  ...domRest
}: ProgressBarViewProps): JSX.Element {
  // Clamp the value so that width never overflows
  const safeValue =
    typeof value === "number" ? Math.min(100, Math.max(0, value)) : undefined
  const isIndeterminate = safeValue === undefined
  return (
    <div
      {...domRest}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={safeValue ?? undefined}
      className={bem(undefined, { animated }, className)}
      id={id}
      role="progressbar"
    >
      <div className={bem("track")}>
        {" "}
        {/* background track */}
        <div
          style={!isIndeterminate ? { width: `${safeValue}%` } : undefined}
          className={bem("bar", {
            [`${variant}`]: true,
            indeterminate: isIndeterminate,
            infinity: Boolean(infinity),
            "indeterminate--infinity": isIndeterminate && Boolean(infinity),
          })}
        />
      </div>
      {!Boolean(hideLabel) && isString(label) && (
        <span className={bem("label")}>{label}</span>
      )}
    </div>
  )
}
