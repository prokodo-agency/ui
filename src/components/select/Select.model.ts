import type { LabelProps } from "../label"
import type {
  ChangeEvent,
  RefObject,
  ReactNode,
  Ref,
  MouseEventHandler,
  KeyboardEventHandler,
  CSSProperties,
  JSX,
} from "react"

/**
 * Change event type union for Select.
 * Accepts synthetic events, native change events, or null.
 */
export type SelectEvent =
  | { target: { dataset?: Record<string, unknown> } }
  | ChangeEvent<HTMLSelectElement>
  | null

/**
 * A single option in the select dropdown list.
 *
 * @example
 * ```tsx
 * const items: SelectItem[] = [
 *   { value: "apple", label: "Apple", icon: () => <FruitIcon /> },
 *   { value: "banana", label: "Banana" }
 * ]
 * ```
 */
export interface SelectItem<Value extends string = string> {
  /** Unique value for this option (used in form submission). */
  value: Value
  /** Display label shown in dropdown and on button. */
  label: string
  /** Optional icon renderer (called with no args). */
  icon?: () => ReactNode
  /** Optional CSS class for custom styling of this item. */
  className?: string
}

/**
 * Union type for select value (single, multiple, or empty).
 */
export type SelectValue<V extends string = string> = V | V[] | ""

/**
 * Dropdown select component props.
 * Supports single/multiple selection with icons, validation, and custom rendering.
 *
 * @example
 * ```tsx
 * // Single select
 * <Select
 *   id="country"
 *   label="Choose Country"
 *   items={items}
 *   value={selected}
 *   onChange={(e, value) => setSelected(value)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Multi-select
 * <Select
 *   id="tags"
 *   label="Select Tags"
 *   multiple={true}
 *   items={items}
 *   value={selectedTags}
 *   onChange={(e, value) => setTags(value)}
 * />
 * ```
 *
 * @a11y Keyboard navigable (Arrow keys, Enter, Escape). Screen reader support with ARIA.
 * @ssr Requires client rendering for interactive dropdown.
 */
export interface SelectProps<Value extends string = string> {
  /* ---------- Structural ---------- */
  /** Unique identifier (used for label association). */
  id: string
  /** Form field name attribute. */
  name?: string
  /** List of selectable options. */
  items: SelectItem<Value>[]
  /** Stretch to full width of parent. */
  fullWidth?: boolean

  /* ---------- Behaviour ---------- */
  /** Allow multiple selections (returns array). */
  multiple?: boolean
  /** Disable interaction. */
  disabled?: boolean
  /** Mark as required (shows asterisk in label). */
  required?: boolean
  /** Current selected value(s). Controlled prop. */
  value?: Value | Value[] | null
  /** Placeholder text when no value selected. */
  placeholder?: string
  /** Called when selection changes. */
  onChange?: (e: SelectEvent, v: SelectValue) => void

  /* ---------- Visual ---------- */
  /** Label text shown above dropdown. */
  label: string
  /** Hide label (but keep in DOM for a11y). */
  hideLabel?: boolean
  /** Show icon inside selected option button. */
  iconVisible?: boolean

  /* ---------- Messaging ---------- */
  /** Helper text shown below dropdown. */
  helperText?: string
  /** Error message shown in red. */
  errorText?: string

  /* ---------- Styling ---------- */
  /** CSS class on root container. */
  className?: string
  /** CSS class on field wrapper. */
  fieldClassName?: string
  /** CSS class on select button. */
  selectClassName?: string
  /** Props forwarded to Label component. */
  labelProps?: LabelProps
  /** Ref to underlying select element. */
  ref?: Ref<HTMLSelectElement>
}

/**
 * Internal client-side state and handlers.
 * Manages dropdown open/close, focus, and portal rendering.
 */
type SelectClientState<V extends string = string> = {
  /** Dropdown is open. */
  open: boolean
  /** Ref to toggle button. */
  buttonRef: RefObject<HTMLButtonElement | null>
  /** Ref to options list. */
  listRef: RefObject<HTMLUListElement | null>
  /** Toggle dropdown on button click. */
  onButtonClick: MouseEventHandler<HTMLButtonElement>
  /** Handle keyboard navigation (ArrowUp/Down, Enter, Escape). */
  onButtonKey: KeyboardEventHandler<HTMLButtonElement>
  /** Select option handler. */
  onOptionClick: (v: V | null) => void
  /**
   * Optional hook for client-only rendering of the listbox.
   * Used to portal the dropdown to document.body to avoid stacking-context clipping.
   * If provided, replaces default in-DOM rendering.
   */
  renderListbox?: (args: {
    /** Generated listbox id (e.g., `${id}-listbox`). */
    id: string
    /** Precomputed BEM class with open/closed modifiers. */
    className: string
    /** Dropdown is currently visible. */
    open: boolean
    /** Inline styles for portal (position, z-index, width). */
    style?: CSSProperties
    /** Field constraints. */
    required?: boolean
    multiple?: boolean
    placeholder?: string
    /** Option data. */
    items: SelectItem<V>[]
    /** Current value(s). */
    value: SelectValue<V>
    /** Option click handler. */
    onOptionClick: (v: V | null) => void
    /** Rendering helpers. */
    iconVisible?: boolean
    bemItem: (mods?: Record<string, boolean>) => string
    bemCheckbox: (mods?: Record<string, boolean>) => string
  }) => JSX.Element | null
}

/**
 * View component props (internal).
 * Extends SelectProps with internal client state.
 */
export type SelectViewProps<V extends string = string> = SelectProps<V> & {
  /** Internal client state (set by wrapper). */
  _clientState?: SelectClientState<V>
}
