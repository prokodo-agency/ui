
import { create } from "@/helpers/bem"

import styles from "./Label.module.scss"

import type { LabelProps } from "./Label.model"
import type { FC } from "react"

const bem = create(styles, "Label")

export const Label: FC<LabelProps> =
({
  className,
  htmlFor,
  required,
  label,
  contentProps,
  textProps,
  error,
  children,
  ...props
}) => {
  const splittedLabel = label?.split(" ")
  if (!splittedLabel) return children
  return (
    <label
      {...props}
      className={bem(undefined, undefined, className)}
      htmlFor={htmlFor}
    >
      <span {...contentProps}>
        <i
          {...textProps}
          className={bem(
            "highlighted",
            {
              error: Boolean(error),
            },
            textProps?.className,
          )}
        >
          {splittedLabel?.[0]}{" "}
        </i>
        <i
          {...textProps}
          className={bem("text", undefined, textProps?.className)}
        >
          {splittedLabel?.slice(1).join(" ")}{" "}
          {Boolean(required) && <span aria-hidden="true">*</span>}
        </i>
      </span>
      {children}
    </label>
  )
}

Label.displayName = "Label"
