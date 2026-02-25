import { List, type ListDefaultItemProps } from "@/components/list"
import { create } from "@/helpers/bem"
import { isArray, isNull } from "@/helpers/validations"

import styles from "./FormResponse.module.scss"

import type { FormResponseProps } from "./Form.model"
import type { FC } from "react"

const bem = create(styles, "FormResponse")

export const FormResponse: FC<FormResponseProps> = ({
  className,
  messages,
  ...props
}) => {
  const errorKeys = Object.keys(messages?.errors || {})
  const listItems: ListDefaultItemProps[] = errorKeys.map(key => ({
    id: key,
    title: key.charAt(0).toUpperCase() + key.slice(1),
    desc: messages?.errors
      ? messages.errors?.[key]?.join(", ")
      : /* istanbul ignore next */ "",
    className: bem("errors__item"),
  }))
  if (!isArray(listItems)) return null
  return (
    <div {...props} className={bem(undefined, undefined, className)}>
      {/* Render the success message */}
      {!isNull(messages?.message) && (
        <p aria-live="polite" className={bem("success")}>
          {messages?.message}
        </p>
      )}

      {/* Render the error messages */}
      {!isNull(messages?.errors) && (
        <List
          aria-live="assertive"
          aria-relevant="all"
          className={bem("errors")}
          classNameDesc={bem("errors__desc")}
          items={listItems}
          role="alert"
          variant="error"
        />
      )}
    </div>
  )
}

FormResponse.displayName = "FormResponse"
