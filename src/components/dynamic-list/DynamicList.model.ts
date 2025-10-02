import type { ButtonProps } from "../button"
import type { InputProps } from "../input"
import type { LabelProps } from "../label"
import type { SelectProps } from "../select"
import type { MouseEvent } from "react"

export type DynamicListFieldInput = Omit<InputProps, "id"> & {
  fieldType?: "input"
  id?: string
}

export type DynamicListFieldSelect = Omit<SelectProps, "id"> & {
  fieldType?: "select"
  id?: string
}

/** Configuration for a single input field in the list */
export type DynamicListField = DynamicListFieldInput | DynamicListFieldSelect

export type DynamicListDefault = {
  id?: string
  /** Prefix used for each input’s `name` attribute, e.g. `"pages"` → `pages[0].name` */
  name: string
  /** Optional wrapper CSS class */
  className?: string
  /** Optional CSS class for each row container */
  classNameList?: string

  /** Props forwarded to the “Add” button */
  buttonAddProps?: ButtonProps

  /**
   * Props forwarded to each “Delete” button.
   * The `onClick` handler receives the mouse event and the row index.
   */
  buttonDeleteProps?: Omit<ButtonProps, "onClick"> & {
    onClick?: (e: MouseEvent<HTMLButtonElement>, index: number) => void
  }

  disabled?: boolean

  label?: string

  labelProps?: Omit<LabelProps, "label" | "required" | "error" | "htmlFor">

  required?: boolean

  errorText?: string

  helperText?: string
}

/**
 * Props for a DynamicList with exactly **one** field per row.
 *
 * @remarks
 * - `fields` must be a tuple of length 1.
 * - `items` is an array of strings (one value per row).
 * - `onChange` is called with the updated string[] whenever the list changes.
 */
export type DynamicListPropsSingle = DynamicListDefault & {
  /** Exactly one field definition */
  fields: [DynamicListField]

  /** Current values (one string per row) */
  value?: string[]

  /** Callback when the array of values changes */
  onChange?: (value: string[]) => void
}

/**
 * Props for a DynamicList with **multiple** fields per row.
 *
 * @remarks
 * - `fields` is an array of `InputProps` definitions (≥2 entries).
 * - `items` is an array of objects, where each object maps each field’s `name` to its current string value.
 * - `onChange` is called with the updated array of `{ [fieldName]: value }` objects.
 */
export type DynamicListPropsMulti = DynamicListDefault & {
  /** Two or more field definitions */
  fields: DynamicListField[]

  /** Current values: one object per row, mapping fieldName → string */
  value?: Record<string, string>[]

  /** Callback when the array of objects changes */
  onChange?: (value: Record<string, string>[]) => void
}

/**
 * Combined props for `<DynamicList>`.
 *
 * - If you pass exactly one field in `fields`, you get a `string[]` list.
 * - If you pass two or more fields, you get a `Record<string,string>[]` list.
 */
export type DynamicListProps = DynamicListPropsSingle | DynamicListPropsMulti
