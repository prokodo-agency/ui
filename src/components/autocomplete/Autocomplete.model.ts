import type { InputProps } from "../input"
import type { KeyboardEventHandler } from "react"

type AutocompleteInputProps = Omit<
  Extract<InputProps, { multiline?: false }>,
  | "id"
  | "name"
  | "value"
  | "onChange"
  | "onFocus"
  | "onKeyDown"
  | "label"
  | "disabled"
  | "required"
  | "fullWidth"
  | "readOnly"
  | "autoComplete"
  | "aria-describedby"
  | "aria-labelledby"
  | "placeholder"
>

/**
 * A single suggestion item shown in the autocomplete listbox.
 *
 * @example
 * ```tsx
 * const item: AutocompleteItem = {
 *   value: "https://www.npmjs.com/package/@prokodo/ui",
 *   label: "@prokodo/ui",
 *   description: "0.1.12 · Prokodo UI component library",
 * }
 * ```
 */
export type AutocompleteItem = {
  /** Canonical value emitted on selection (e.g. URL, ID). */
  value: string
  /** Human-readable display label. */
  label: string
  /** Optional second line for meta information (version, summary, etc.). */
  description?: string
}

/**
 * Change event emitted while the user types.
 *
 * Best practice: use this event to trigger local filtering or async fetching.
 */
export type AutocompleteChangeEvent = {
  /** Current raw input query string. */
  query: string
}

/**
 * Internal client interaction state used by the view layer.
 *
 * @internal
 */
export type AutocompleteClientState = {
  /** Whether the listbox panel is visible. */
  open: boolean
  /** Pixel offset from autocomplete root to the input field bottom. */
  listTop?: number
  /** Currently keyboard-highlighted option index. */
  activeIndex: number
  /** Handles text updates from the input. */
  onInputChange: (query: string) => void
  /** Handles focus-driven open logic. */
  onInputFocus: () => void
  /** Handles keyboard navigation (ArrowUp/ArrowDown/Enter/Escape). */
  onInputKeyDown: KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>
  /** Handles option selection. */
  onSelectItem: (item: AutocompleteItem) => void
}

/**
 * Public props for the Autocomplete component.
 *
 * Best practice:
 * - Keep the component controlled via `value` + `onChange`.
 * - Store canonical data in `item.value` and show friendly text in `item.label`.
 * - Use `onSelect` to persist selected entity IDs/URLs.
 * - Use `inputProps` for advanced Input-level options (e.g. `hideLabel`).
 */
export type AutocompleteProps = {
  /** Optional DOM id. If omitted, consumer should still ensure unique name usage. */
  id?: string
  /** Form field name used by the underlying Input element. */
  name: string
  /** Visible label text rendered by Input. */
  label?: string
  /** Input placeholder text. */
  placeholder?: string
  /** Marks field as required (a11y + UI indicator). */
  required?: boolean
  /** Disables typing/interaction. */
  disabled?: boolean
  /** Stretches input to full container width. */
  fullWidth?: boolean
  /** Makes input read-only while preserving focusability. */
  readOnly?: boolean
  /** Native browser autocomplete attribute. */
  autoComplete?: string
  /** Optional aria-describedby forwarded to Input. */
  "aria-describedby"?: string
  /** Optional aria-labelledby forwarded to Input. */
  "aria-labelledby"?: string
  /** Controlled input value (query string). */
  value?: string
  /** Suggestion items currently shown in listbox. */
  items?: AutocompleteItem[]
  /** Loading indicator for async search scenarios. */
  loading?: boolean
  /** Text shown while loading. */
  loadingText?: string
  /** Text shown when no results are available. */
  emptyText?: string
  /** Minimum characters required before searching/listing results. */
  minQueryLength?: number
  /**
   * Message shown when query length is below `minQueryLength`.
   * Supports `{count}` placeholder replacement.
   *
   * @example "Please enter at least {count} characters"
   */
  minQueryLengthText?: string
  /** Root wrapper class. */
  className?: string
  /** Input wrapper class. */
  inputClassName?: string
  /** Listbox panel class. */
  listClassName?: string
  /** Option row class. */
  itemClassName?: string
  /**
   * Direct passthrough props to underlying `Input`.
   *
   * Use this for Input-specific behavior that is not exposed as top-level
   * Autocomplete props, e.g. `hideLabel`, `hideLegend`, `helperText`,
   * `labelProps`, `fieldClassName`, `inputContainerClassName`, etc.
   */
  inputProps?: AutocompleteInputProps & {
    /**
     * Convenience alias for hiding the visible label.
     * Internally mapped to Input's `hideLegend`.
     */
    hideLabel?: boolean
  }
  /** Emitted whenever query text changes. */
  onChange?: (event: AutocompleteChangeEvent) => void
  /** Emitted when an item is selected (mouse/keyboard). */
  onSelect?: (item: AutocompleteItem) => void
}

/**
 * Internal props for the view component.
 *
 * @internal
 */
export type AutocompleteViewProps = Omit<
  AutocompleteProps,
  "onChange" | "onSelect"
> & {
  /** Optional open flag injected by client wrapper. */
  open?: boolean
  /** Internal client state handlers. */
  _clientState?: AutocompleteClientState
  /** Optional pass-through for story/view-only scenarios. */
  onChange?: (event: AutocompleteChangeEvent) => void
  /** Optional pass-through for story/view-only scenarios. */
  onSelect?: (item: AutocompleteItem) => void
}
