import { type FC, type HTMLAttributes, useMemo, memo } from "react"

import { List, type ListDefaultItemProps } from "@/components/list"
import { create } from "@/helpers/bem"
import { isArray, isNull } from "@/helpers/validations"

import styles from "./FormResponse.module.scss"

import type { FormMessages } from "./Form.model"

const bem = create(styles, "FormResponse")

export type FormResponseProps = HTMLAttributes<HTMLDivElement> & {
  messages?: FormMessages
}

export const FormResponse: FC<FormResponseProps> = memo(
  ({ className, messages, ...props }) => {
    const errorKeys = useMemo(
      () => Object.keys(messages?.errors || {}),
      [messages?.errors],
    )
    const listItems: ListDefaultItemProps[] = useMemo(
      () =>
        errorKeys.map(key => ({
          title: key.charAt(0).toUpperCase() + key.slice(1),
          desc: messages?.errors ? messages.errors?.[key]?.join(", ") : "",
          className: bem("errors__item"),
        })),
      [errorKeys, messages?.errors],
    )
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
  },
)

FormResponse.displayName = "FormResponse"
