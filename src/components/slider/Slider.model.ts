import type { LabelProps } from "../label"
import type { SliderProps as MUISliderProps } from "@mui/base/Slider"
import type { HTMLAttributes } from "react"

export type SliderProps = Omit<MUISliderProps, "value"> & {
  id: string
  value?: string | number | number[]
  label?: string
  labelProps?: LabelProps
  valueLabelProps?: HTMLAttributes<HTMLSpanElement>
  required?: boolean
}
