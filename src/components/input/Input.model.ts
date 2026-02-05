import type { LabelProps } from "../label"
import type {
  Ref,
  ChangeEvent,
  ChangeEventHandler,
  FocusEvent,
  HTMLInputTypeAttribute,
  TextareaHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react"

/* ---------- Basistypen ---------------------------------- */

/** Supported HTML input types (excludes date/time pickers—use DatePicker component). */
export type FieldType = Omit<
  HTMLInputTypeAttribute,
  "date" | "datetime-local" | "month" | "week" | "time"
>

/** Change event for input or textarea. Use to extract `event.target.value`. */
export type InputChangeEvent = ChangeEvent<
  HTMLTextAreaElement | HTMLInputElement
>

/** Change event handler for input or textarea. Fires on every keystroke/paste. */
export type InputChangeEventHandler = ChangeEventHandler<
  HTMLTextAreaElement | HTMLInputElement
>

/**
 * Validation callback. Called after change event processing.
 * @param name - Input name (for form context)
 * @param error - Error message if validation fails; undefined if valid
 */
export type InputValidateEvent = (name: string, error?: string) => void

/** Focus event for input or textarea. Use to detect field focus or blur logic. */
export type InputFocus = FocusEvent<HTMLTextAreaElement | HTMLInputElement>

/** Focus event handler. Fires when field gains focus (input/textarea). */
export type InputFocusEventHandler = ChangeEventHandler<
  HTMLTextAreaElement | HTMLInputElement
>

/** Blur event (alias for focus event). */
export type InputBlur = InputFocus

/** Blur event handler. Fires when field loses focus. */
export type InputBlurEventHandler = ChangeEventHandler<
  HTMLTextAreaElement | HTMLInputElement
>

/**
 * Arguments passed to custom render function (renderNode).
 * Provides necessary a11y attributes and state flags.
 */
export type InputRenderNodeArgs = {
  /** Auto-generated ID for label/aria-describedby association. */
  id: string
  /** Input name attribute. */
  name: string
  /** Field is disabled (pointer-events: none, opacity). */
  disabled?: boolean
  /** Field is required (marked with asterisk). */
  required?: boolean
  /** Field is read-only (no edits allowed). */
  readOnly?: boolean
  /** Placeholder text. */
  placeholder?: string
  /** True if error is present; false otherwise. Used for styling. */
  isError: boolean
  /** ID(s) for aria-describedby (link to error/helper text). */
  describedBy?: string
  /** Root CSS class for custom field node styling. */
  nodeClassName: string
}

/**
 * Validation error messages per field type.
 * Maps to built-in validation rules (required, email, tel, etc.).
 */
export type InputErrorTranslations = {
  /** "This field is required" or similar. */
  required?: string
  /** "Enter a valid email" for type="email". */
  email?: string
  /** "Enter a valid phone number" for type="tel". */
  tel?: string
  /** Generic text validation error. */
  text?: string
  /** "Enter a valid URL" for type="url". */
  url?: string
  /** "Enter a valid number" for type="number". */
  number?: string
  /** "Select a valid color" for type="color". */
  color?: string
  /** "Password does not meet requirements" for type="password". */
  password?: string
  /** "Must be at least N" for min validation (e.g., min age). */
  min?: string
  /** "Must not exceed N" for max validation. */
  max?: string
}

/* ---------- Props --------------------------------------- */

/**
 * Input component props.
 * Supports single-line text inputs and multi-line textareas.
 * Includes built-in validation, error display, character counter, and custom render function.
 *
 * @example
 * // Single-line input
 * <Input name="email" type="email" label="Email" required />
 *
 * @example
 * // Multi-line textarea with min/max rows
 * <Input name="bio" multiline minRows={3} maxRows={6} label="Bio" />
 *
 * @example
 * // Custom render function for specialized fields
 * <Input name="code" renderNode={(args) => <CodeEditor {...args} />} />
 */
export type InputProps = {
  /** Auto-focus on mount. Useful for modal/dialog first field. */
  isFocused?: boolean
  /** Ref to underlying input element. Use for imperative access (focus, blur, value reset). */
  inputRef?: Ref<HTMLInputElement>
  /** Custom regex pattern for validation. Overrides type-based validation. */
  customRegexPattern?: string
  /** Field wrapper class name (outer container). */
  fieldClassName?: string
  /** Hide character count indicator (default: false). Only applies to multiline fields. */
  hideCounter?: boolean
  /** Input container class name. Direct parent of input/textarea element. */
  inputContainerClassName?: string
  /** Input/textarea element class name. */
  inputClassName?: string
  /** Width: 100% of parent. Default: false (auto width). */
  fullWidth?: boolean
  /** Disable input (grayed out, no interaction). Aria-disabled=true. */
  disabled?: boolean
  /** Mark as required. Shows asterisk in label and enforces validation. */
  required?: boolean
  /** Unique field name. Required for form integration and validation callbacks. */
  name: string
  /** Label text. If omitted, no label element is rendered. */
  label?: string
  /** Label props (className, variant, etc.). Passed to Label component. */
  labelProps?: Omit<LabelProps, "label" | "required" | "error" | "htmlFor">
  /** Validation error messages per type. Falls back to defaults if not provided. */
  errorTranslations?: InputErrorTranslations
  /** Minimum value (number inputs) or length (text). Triggers min error message. */
  min?: string | number
  /** Maximum value (number inputs) or length (text). Triggers max error message. */
  max?: string | number
  /** Max character count (text inputs). Shows counter if not `hideCounter=true`. */
  maxLength?: number
  /** Current field value. Controlled component. */
  value?: string | number
  /** Hide label legend/fieldset. Useful for icon-only or placeholder-only inputs. */
  hideLegend?: boolean
  /** Custom error message. Overrides auto-generated errors. Shows red text below field. */
  errorText?: string
  /** Helper text below field (gray, informational). Not an error. */
  helperText?: string
  /** Fires on input/textarea change (every keystroke, paste). */
  onChange?: InputChangeEventHandler
  /** Fires after change event. Receives field name and error (if validation fails). */
  onValidate?: InputValidateEvent
  /** Fires when field gains focus. */
  onFocus?: InputFocusEventHandler
  /** Fires when field loses focus (blur). */
  onBlur?: InputBlurEventHandler
  /**
   * Render a custom field node instead of native input/textarea.
   * Keeps label/footer/error/counter layout intact.
   * Useful for date pickers, code editors, rich text, or specialized inputs.
   * Must manage its own value and change events via `id` and `describedBy`.
   */
  renderNode?: (args: InputRenderNodeArgs) => ReactNode
} & (
  | {
      /* ---------- Single-line input --------------------------- */
      /** Single-line input (default). Mutually exclusive with `multiline=true`. */
      multiline?: false
      /** HTML input type (text, email, tel, url, number, password, color, etc.). */
      type?: FieldType
      /** Textarea rows (ignored for single-line). */
      rows?: undefined
      /** Minimum rows (ignored for single-line). */
      minRows?: undefined
      /** Maximum rows (ignored for single-line). */
      maxRows?: undefined
    }
  | {
      /* ---------- Multi-line textarea ----------------------- */
      /** Multi-line textarea. Mutually exclusive with `multiline=false`. */
      multiline: true
      /** Not applicable for textarea (ignored). */
      type?: undefined
      /** Textarea initial row count. Default: auto-adjust. */
      rows?: number
      /** Minimum rows (auto-expand below this). */
      minRows?: number
      /** Maximum rows (scroll if exceeded). */
      maxRows?: number
    }
) &
  Omit<
    InputHTMLAttributes<HTMLInputElement> &
      TextareaHTMLAttributes<HTMLTextAreaElement>,
    "color" | "value" | "onChange" | "maxLength" | "type" | "rows"
  >
