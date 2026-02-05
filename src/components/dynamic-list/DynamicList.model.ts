import type { ButtonProps } from "../button"
import type { InputProps } from "../input"
import type { LabelProps } from "../label"
import type { SelectProps } from "../select"
import type { MouseEvent } from "react"

/**
 * Input field configuration for DynamicList.\
 * Inherits all Input props; `id` is auto-generated (optional).
 */
export type DynamicListFieldInput = Omit<InputProps, "id"> & {
  /** Field type marker (optional; defaults to "input"). */
  fieldType?: "input"
  /** Auto-generated field ID (optional; overridable for custom form integration). */
  id?: string
}

/**
 * Select (dropdown) field configuration for DynamicList.\
 * Inherits all Select props; `id` is auto-generated (optional).
 */
export type DynamicListFieldSelect = Omit<SelectProps, "id"> & {
  /** Field type marker: "select" for dropdown fields. */
  fieldType?: "select"
  /** Auto-generated field ID (optional; overridable for custom form integration). */
  id?: string
}

/**
 * Single row field configuration: Input or Select.\
 * Used in `fields` array; determines rendered control type.
 */
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
 * Props for single-field DynamicList mode.\
 * Each row contains exactly **one** input/select field.\
 * Value is a simple `string[]` array.
 *
 * @example
 * // List of email addresses
 * <DynamicList
 *   name="emails"
 *   fields={[{ type: "email", name: "email" }]}
 *   value={["user1@example.com", "user2@example.com"]}
 *   onChange={(values) => console.log(values)}
 * />
 *
 * @remarks
 * - Discriminated by: `fields` length = 1
 * - Value shape: `string[]` (one value per row)
 * - onChange receives: `string[]`
 */
export type DynamicListPropsSingle = DynamicListDefault & {
  /** Exactly one field definition (tuple of length 1). */
  fields: [DynamicListField]

  /** Current values: one string per row. */
  value?: string[]

  /** Callback when list changes. Receives updated `string[]` array. */
  onChange?: (value: string[]) => void
}

/**
 * Props for multi-field DynamicList mode.\
 * Each row contains **two or more** input/select fields.\
 * Value is a `Record<string, string>[]` array (one object per row).
 *
 * @example
 * // List of names and emails
 * <DynamicList
 *   name="contacts"
 *   fields={[
 *     { name: "firstName", type: "text" },
 *     { name: "email", type: "email" }
 *   ]}
 *   value={[
 *     { firstName: "John", email: "john@example.com" },
 *     { firstName: "Jane", email: "jane@example.com" }
 *   ]}
 *   onChange={(values) => setContacts(values)}
 * />
 *
 * @remarks
 * - Discriminated by: `fields` length ≥ 2
 * - Value shape: `Record<string, string>[]` (object per row, keys = field names)
 * - onChange receives: `Record<string, string>[]`
 */
export type DynamicListPropsMulti = DynamicListDefault & {
  /** Two or more field definitions. */
  fields: DynamicListField[]

  /** Current values: one object per row, mapping fieldName → fieldValue. */
  value?: Record<string, string>[]

  /** Callback when list changes. Receives updated array of objects. */
  onChange?: (value: Record<string, string>[]) => void
}

/**
 * DynamicList component props.\
 * Manages a dynamic array of input/select fields with add/delete row controls.\
 * Supports two modes based on field count:\
 * 1. **Single-field mode**: 1 field → `string[]` values\
 * 2. **Multi-field mode**: 2+ fields → `Record<string, string>[]` values
 *
 * @example
 * // Single-field mode (emails list)
 * <DynamicList
 *   name="emails"
 *   label="Email Addresses"
 *   fields={[{ type: "email", name: "email" }]}
 *   value={emails}
 *   onChange={setEmails}
 * />
 *
 * @example
 * // Multi-field mode (contact list)
 * <DynamicList
 *   name="contacts"
 *   label="Team Members"
 *   fields={[
 *     { name: "firstName", label: "First Name" },
 *     { name: "lastName", label: "Last Name" },
 *     { name: "email", type: "email", label: "Email" }
 *   ]}
 *   value={contacts}
 *   onChange={setContacts}
 *   buttonAddProps={{ label: "+ Add Member" }}
 * />
 */
export type DynamicListProps = DynamicListPropsSingle | DynamicListPropsMulti
