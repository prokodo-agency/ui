/* eslint-disable */
import type {
  FormEvent,
  ReactElement,
  FormHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
} from "react"
import type { ButtonProps } from "../button"
import type { HeadlineProps } from "../headline"

import {
  DatePicker,
  type DatePickerProps,
  type DatePickerErrorTranslations,
} from "../datePicker"
import { DynamicList, type DynamicListProps } from "../dynamic-list"
import { Input, type InputProps, type InputErrorTranslations } from "../input"
import { InputOTP } from "../inputOTP"
import { Select, type SelectProps } from "../select"
import { Slider, type SliderProps } from "../slider"
import { Switch, type SwitchProps } from "../switch"
import { Rating, type RatingProps } from "../rating"
import type { FormFieldProps } from "./FormField.client"
/* eslint-enable */

/**
 * Visual color variant for the form theme.
 * Maps to semantic color tokens or neutral styles.
 */
export type FormVariants =
  | "inherit"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning"

/**
 * Supported form field types.
 * Each type maps to a specific component with compatible props.
 */
export type FormFieldTypes =
  | "input"
  | "select"
  | "switch"
  | "slider"
  | "date"
  | "dynamic-list"
  | "rating"

/**
 * Union type for field values across all field types.
 * Type narrowed based on fieldType.
 */
export type FormFieldValue =
  | string
  | boolean
  | string[]
  | Record<string, string>[]
  | undefined

/**
 * Conditional visibility rules for fields.
 * Shows/hides and updates props based on sibling field values.
 *
 * @example
 * ```tsx
 * {
 *   fieldId: "country",
 *   equalTo: "USA",
 *   updateProps: { disabled: false, visible: true }
 * }
 * ```
 */
export type FormFieldCondition = {
  /** ID of the field to watch. */
  fieldId: string
  /** Value that triggers the condition. */
  equalTo: boolean | string | string[]
  /** Props to apply when condition is met. */
  updateProps: Partial<FormField>
}

/**
 * Base properties shared by all field types.
 * Extended by specific field type interfaces.
 */
export type FormFieldOptionals = {
  /** Explicit field type (inferred from union if not provided). */
  fieldType?: FormFieldTypes
  /** Show/hide field (conditional visibility). */
  visible?: boolean
  /** Conditional rendering rules based on other fields. */
  conditions?: FormFieldCondition[]
  /** Initial field value. */
  value?: FormFieldValue
}

/**
 * Text input field variant.
 * Inherits all Input props with form-specific features.
 */
export type FormFieldInput = FormFieldOptionals & {
  fieldType: "input"
} & InputProps

/**
 * Dropdown select field variant.
 * Inherits all Select props.
 */
export type FormFieldSelect = FormFieldOptionals & {
  fieldType: "select"
} & SelectProps

/**
 * Toggle switch field variant.
 * Inherits all Switch props.
 */
export type FormFieldSwitch = FormFieldOptionals & {
  fieldType: "switch"
} & SwitchProps

/**
 * Range slider field variant.
 * Inherits all Slider props.
 */
export type FormFieldSlider = FormFieldOptionals & {
  fieldType: "slider"
} & SliderProps

/**
 * Date picker field variant.
 * Inherits all DatePicker props.
 */
export type FormFieldDate = FormFieldOptionals & {
  fieldType: "date"
} & DatePickerProps

/**
 * Repeatable field list variant.
 * Inherits all DynamicList props.
 */
export type FormFieldDynamicList = FormFieldOptionals & {
  fieldType: "dynamic-list"
} & DynamicListProps

/**
 * Star rating field variant.
 * Inherits all Rating props.
 */
export type FormFieldRating = FormFieldOptionals & {
  fieldType: "rating"
} & RatingProps

/**
 * Union type for any form field.
 * Type narrowed based on fieldType.
 */
export type FormField =
  | FormFieldInput
  | FormFieldSelect
  | FormFieldSwitch
  | FormFieldSlider
  | FormFieldDate
  | FormFieldDynamicList
  | FormFieldRating

/**
 * Server-side validation errors keyed by field ID.
 * Each field can have multiple error messages.
 */
export type FormMessagesErrors = {
  [key: string]: string[]
}

/**
 * Form-level response message (success/error).
 * Shown after submission.
 */
export type FormMessages = {
  message?: string
  errors?: FormMessagesErrors
}

/**
 * Field-level error translations for input validation.
 */
export type FormFieldMessagesErrorsInput = InputErrorTranslations
/**
 * Field-level error translations for date validation.
 */
export type FormFieldMessagesErrorsDate = DatePickerErrorTranslations

/**
 * Error message map for different field types.
 */
export type FormFieldMessagesErrors = {
  required?: string
  input?: FormFieldMessagesErrorsInput
  date?: FormFieldMessagesErrorsDate
}

/**
 * Error configuration per field.
 */
export type FormFieldMessages = {
  errors?: FormFieldMessagesErrors
}

/**
 * Allowed child components in Form (direct children).
 */
export type FormAllowedChildren =
  | ReactElement<typeof DatePicker>
  | ReactElement<typeof Input>
  | ReactElement<typeof InputOTP>
  | ReactElement<typeof Select>
  | ReactElement<typeof Slider>
  | ReactElement<typeof Switch>
  | ReactElement<typeof DynamicList>
  | ReactElement<typeof Rating>

/**
 * Props wrapper for form children.
 */
export type ParentComponentProps = {
  children: FormAllowedChildren | FormAllowedChildren[]
}

/**
 * Response message container props.
 * Displays form submission status.
 */
export type FormResponseProps = HTMLAttributes<HTMLDivElement> & {
  messages?: FormMessages
}

/**
 * Callback fired when any field value changes.
 * @param fields - The updated field.
 */
export type OnChangeFormHandler = (fields: FormField) => void

/**
 * Submit button props extended from ButtonProps.
 */
export type FormButton = Omit<ButtonProps, "title"> & {
  title?: string
}

/**
 * Main Form component props for creating multi-field forms.
 * Supports conditional visibility, validation, and server-side errors.
 *
 * @example
 * ```tsx
 * // Basic form with text and select
 * <Form
 *   label="Contact Form"
 *   fields={[
 *     { id: "name", fieldType: "input", label: "Name", required: true },
 *     { id: "country", fieldType: "select", label: "Country", items: [...] }
 *   ]}
 *   onSubmit={(fields) => submitForm(fields)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Form with conditional fields
 * <Form
 *   label="Signup"
 *   fields={[
 *     { id: "type", fieldType: "select", label: "Account Type", items: [...] },
 *     {
 *       id: "company",
 *       fieldType: "input",
 *       label: "Company",
 *       conditions: [
 *         { fieldId: "type", equalTo: "business", updateProps: { visible: true } }
 *       ]
 *     }
 *   ]}
 * />
 * ```
 *
 * @a11y Form announces validation errors to screen readers via aria-live.
 * @ssr Requires client rendering for interactive functionality.
 */
export type FormProps = {
  /** Form title/label (used in headline). */
  label: string
  /** Disable all form fields. */
  disabled?: boolean
  /** Color variant for theme. */
  variant?: FormVariants
  /** Hide success/error message after submission. */
  hideResponse?: boolean
  /** Array of fields to render. */
  fields?: FormField[]
  /** Hide the form title headline. */
  hideHeadline?: boolean
  /** Props forwarded to headline element. */
  headlineProps?: HeadlineProps
  /** Default field values (fallback if fields not provided). */
  defaultFields?: FormField[]
  /** Form-level success/error messages. */
  messages?: FormMessages
  /** Field-level error translations. */
  messagesFields?: FormFieldMessages
  /** Submit button config (overrides defaults). */
  button?: FormButton
  /** Called on form submission with validated fields. */
  onSubmit?: (fields: FormField[]) => void
  /** Called whenever any field changes. */
  onChangeForm?: OnChangeFormHandler
} & Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit">

/**
 * Internal view props with computed state.
 * Used by Form.view component (not public API).
 */
export type FormViewProps = FormProps & {
  formState: Omit<FormField, "onChange">[]
  formMessages?: FormMessages
  honeypot: InputHTMLAttributes<HTMLInputElement>
  isHoneypotEmpty?: boolean
  fieldProps?: FormFieldProps
  onFormSubmit: (e: FormEvent<HTMLFormElement>) => void
  isFormValid: boolean
}
