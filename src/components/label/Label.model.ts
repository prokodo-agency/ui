import type { LabelHTMLAttributes, HTMLAttributes } from "react"

export type LabelProps = Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  "htmlFor"
> & {
  required?: boolean
  error?: boolean
  label?: string
  contentProps?: HTMLAttributes<HTMLSpanElement>
  textProps?: HTMLAttributes<HTMLElement>
  htmlFor?: string
}
