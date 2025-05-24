import type { LabelProps } from "../label"
import type {
  SelectProps as MUISelectProps,
  OptionProps,
  SelectValue as MUISelectValue,
} from "@mui/base"
import type {
  ReactNode,
  Ref,
  MouseEvent,
  KeyboardEvent,
  FocusEvent,
} from "react"

export type SelectEvent = MouseEvent | KeyboardEvent | FocusEvent | null
export type SelectChangeEvent = SelectProps["onChange"]

// Define a default value type for the select component
type DefaultValueType = string

// Define the type for individual select items, with a default generic type for the value
export type SelectItem<Value = DefaultValueType> = Omit<
  OptionProps<Value>,
  "children"
> & {
  label?: string
  icon?: () => ReactNode
}

export type SelectValueSingle = MUISelectValue<DefaultValueType, false>
export type SelectValueMultiple = MUISelectValue<DefaultValueType, true>

// Define the supported colors for the select component
export type SelectColor =
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning"

// Adjust the SelectProps type to correctly handle `multiple` prop:
export type SelectProps<
  OptionValue extends {} = DefaultValueType,
  Multiple extends boolean = false | true,
  RootComponentType extends React.ElementType = "button",
> = Omit<
  MUISelectProps<OptionValue, Multiple, RootComponentType>, // Use MUISelectProps with the updated Multiple type
  "variant" | "color" | "name" | "onChange"
> & {
  ref?: Ref<HTMLButtonElement> // Ensure ref is typed as HTMLButtonElement
  id: string
  iconVisible?: boolean
  name: string
  color?: SelectColor
  label: string
  hideLabel?: boolean
  labelProps?: Omit<LabelProps, "label" | "require" | "error">
  classNameSelect?: string
  items: SelectItem<OptionValue>[] // Ensure items can handle the OptionValue type
  multiple?: Multiple // Add multiple to the type explicitly
  errorText?: string
  helperText?: string
  onChange?: (e: SelectEvent, value: string | string[] | null) => void
}
