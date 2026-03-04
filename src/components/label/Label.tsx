import { create } from "@/helpers/bem"

import styles from "./Label.module.scss"

import type { LabelProps } from "./Label.model"
import type { FC, LabelHTMLAttributes } from "react"

const bem = create(styles, "Label")

export const Label: FC<LabelProps> = ({
  type = "label",
  className,
  required,
  label,
  contentProps,
  textProps,
  error,
  color,
  children,
  ...props
}) => {
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
          {label} {Boolean(required) && <span aria-hidden="true">*</span>}
        </i>
      </span>
      {children}
    </>
  )

  if (!label) return children
  if (type === "legend") {
    return (
      <legend
        {...props}
        className={bem(
          undefined,
          color ? { [color]: true } : undefined,
          className,
        )}
      >
        {renderContent()}
      </legend>
    )
  }
  return (
    <label
      {...(props as LabelHTMLAttributes<HTMLLabelElement>)}
      className={bem(
        undefined,
        color ? { [color]: true } : undefined,
        className,
      )}
    >
      {renderContent()}
    </label>
  )
}

Label.displayName = "Label"
