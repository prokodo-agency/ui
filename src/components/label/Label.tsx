
import { create } from "@/helpers/bem"

import styles from "./Label.module.scss"

import type { LabelProps } from "./Label.model"
import type { FC, LabelHTMLAttributes } from "react"

const bem = create(styles, "Label")

export const Label: FC<LabelProps> =
({
  type = "label",
  className,
  required,
  label,
  contentProps,
  textProps,
  error,
  children,
  ...props
}) => {
  const splittedLabel = label?.split(" ")

  const renderContent = () => (
    <>
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
    </>
  )

  if (!splittedLabel) return children
  if (type === "legend") {
    return (
      <legend
        {...props}
        className={bem(undefined, undefined, className)}
      >
        {renderContent()}
      </legend>
    )
  }
  return (
    <label
      {...props as LabelHTMLAttributes<HTMLLabelElement>}
      className={bem(undefined, undefined, className)}
    >
      {renderContent()}
    </label>
  )
}

Label.displayName = "Label"
