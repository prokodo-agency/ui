import type { IconProps } from "@/components/icon"
import type { HTMLAttributes } from "react"

/**
 * One selectable option within the checkbox group.
 */
export type CheckboxGroupOption<T extends string> = {
  /** Submitted value for this option. */
  value: T
  /** Main label text. */
  title: string
  /** Optional description displayed under title. */
  description?: string | null
  /** Optional right-aligned icon definition. */
  icon?: Omit<IconProps, "label"> | null
  /** Accessible label for the optional icon. */
  iconLabel?: string | null
  /** Marks this specific option as required. */
  required?: boolean
  /** Disables this option only. */
  disabled?: boolean
}

/**
 * Visual style for each checkbox row.
 */
export type CheckboxGroupVariant = "plain" | "card"

/**
 * Layout strategy of the option list.
 */
export type CheckboxGroupLayout = "stack" | "grid"

/**
 * Optional translation slots for accessibility labels.
 */
export type CheckboxGroupTranslations = {
  ariaLabel?: string
}

/**
 * Public API of CheckboxGroup.
 */
export type CheckboxGroupProps<T extends string> = {
  /** Accessible label for the fieldset; fallback in translations. */
  ariaLabel?: string
  /** Optional visible legend for grouped meaning. */
  legend?: string | null
  /** Keeps legend in DOM but visually hidden (screen-reader only). */
  hideLegend?: boolean
  /** Extra props for the legend node. */
  legendProps?: HTMLAttributes<HTMLLegendElement>

  /** Shared input name of all checkbox options. */
  name: string
  /** Disable whole group. */
  disabled?: boolean
  /** Marks at least one option as required (native form behavior). */
  required?: boolean

  /** Controlled selected values. */
  values?: T[]
  /** Uncontrolled initial selected values. */
  defaultValues?: T[]

  /** All options to render. */
  options: CheckboxGroupOption<T>[]

  /** Emits next selected values after every toggle. */
  onChange?: (next: T[]) => void

  /** Optional hidden input mirror (comma-separated values). */
  hiddenInputName?: string

  /** Layout mode of options. */
  layout?: CheckboxGroupLayout
  /** Visual style variant of each option row. */
  variant?: CheckboxGroupVariant

  /** Optional i18n values. */
  translations?: CheckboxGroupTranslations
}

/**
 * Internal props consumed by the pure view renderer.
 */
export type CheckboxGroupViewProps<T extends string> = CheckboxGroupProps<T> & {
  selectedValues: T[]
  isChecked: (value: T) => boolean
  onToggle?: (value: T) => void
}
