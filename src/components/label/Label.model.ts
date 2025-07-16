import type { LabelHTMLAttributes, HTMLAttributes } from "react"

export type LabelDefaultrops = {
  required?: boolean
  error?: boolean
  label?: string
  contentProps?: HTMLAttributes<HTMLSpanElement>
  textProps?: HTMLAttributes<HTMLElement>
}

export type LabelLegendProps = HTMLAttributes<HTMLLegendElement> & {
  type?: "legend"
} & LabelDefaultrops

export type LabelElementProps = Omit<
  LabelHTMLAttributes<HTMLLegendElement>,
  "htmlFor"
> & {
  type?: "label"
  htmlFor?: string
} & LabelDefaultrops

export type LabelProps = LabelElementProps | LabelLegendProps
