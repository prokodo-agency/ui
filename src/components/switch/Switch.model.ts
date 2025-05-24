import type { IconName } from "../icon"
import type { LabelProps } from "../label"
import type { SwitchProps as MUISwitchProps } from "@mui/base"
import type { ChangeEvent } from "react"

// Define the supported colors for the switch component
export type SwitchColor =
  | "inherit"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning"

// Define custom SwitchProps for the refactored Switch component
export type SwitchProps = Omit<MUISwitchProps, "component" | "onChange"> & {
  variant?: SwitchColor
  label?: string
  labelProps?: Omit<LabelProps, "label" | "require">
  name: string
  icon?: IconName
  checkedIcon?: IconName
  onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void
}

// Define a type for icon rendering
export type IconRenderProps = {
  name: IconName
  isChecked?: boolean
}
