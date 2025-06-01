import type { IconName } from "../icon"
import type { LabelProps } from "../label"
import type { ChangeEvent, HTMLAttributes, FocusEvent } from "react"

/**
 * Supported color variants (derived from the original "variant" prop).
 */
export type SwitchColor =
  | "inherit"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning"

export type SwitchProps = HTMLAttributes<HTMLInputElement> & {
  /** The ID and name of this switch instance (used for Label htmlFor). */
  name: string

  /** The text label displayed next to the switch. */
  label?: string

  /** If true, the label will be marked as required. */
  required?: boolean

  /** Color variant—corresponds to the original SCSS class names. */
  variant?: SwitchColor

  /** Icon name to display when the switch is _not_ checked. */
  icon?: IconName

  /** Icon name to display when the switch is checked. */
  checkedIcon?: IconName

  /** Whether the switch is currently checked (controlled). */
  checked?: boolean

  /** Disable the switch when true. */
  disabled?: boolean

  /** Custom error message */
  errorText?: string;

  /** Custom helper message */
  helperText?: string;

  /**
   * Called whenever the switch state changes.
   * Callback signature: (event, checked) => void.
   */
  onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void

  /** Additional CSS class to apply to the outer container div. */
  className?: string

  /** Additional props forwarded to the `<Label>` (e.g. id, style). */
  labelProps?: Omit<LabelProps, "label" | "htmlFor" | "required">

  /**
   * If true, visually hides the label but keeps it in the DOM for screen readers
   * (visually-hidden) to satisfy AAA requirements.
   */
  hideLabel?: boolean
}

/**
 * Internally used prop types to pass current checked state and focus status.
 */
export interface SwitchViewProps extends SwitchProps {
  /** Current internal checked state (true = on). */
  isChecked: boolean

  /** True if the <input> is currently focused. */
  isFocused: boolean

  /** Internal change handler: (event) => void. */
  onChangeInternal: (e: ChangeEvent<HTMLInputElement>) => void

  /** Internal focus handler: (event) => void. */
  onFocusInternal: (e: FocusEvent<HTMLInputElement>) => void

  /** Internal blur handler: (event) => void. */
  onBlurInternal: (e: FocusEvent<HTMLInputElement>) => void
}
