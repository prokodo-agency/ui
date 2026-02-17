import type { IconProps } from "@/components/icon"
import type { ChangeEvent, HTMLAttributes, ReactNode } from "react"

/**
 * Visual style variants for the checkbox row.
 */
export type CheckboxVariant = "plain" | "card"

/**
 * Public props for a single checkbox option.
 */
export type CheckboxProps<T extends string = string> = Omit<
  HTMLAttributes<HTMLInputElement>,
  "onChange" | "title"
> & {
  /** Input name used for form integration. */
  name: string

  /** Submitted value when checked. */
  value: T

  /** Main label content of the option. */
  title: ReactNode

  /** Optional supporting description below title. */
  description?: ReactNode | null

  /** Optional right-aligned icon definition. */
  icon?: Omit<IconProps, "label"> | null

  /** Accessible label for the optional icon. */
  iconLabel?: string | null

  /** Controlled checked state. */
  checked?: boolean

  /** Uncontrolled initial checked state. */
  defaultChecked?: boolean

  /** Marks input as required in forms. */
  required?: boolean

  /** Controls whether the required marker is shown next to the title. */
  showRequiredMark?: boolean

  /** Disables interaction. */
  disabled?: boolean

  /** Visual variant, defaults to "plain". */
  variant?: CheckboxVariant

  /** Called whenever checked state changes. */
  onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void

  /** Additional class on root label element. */
  className?: string
}

/**
 * Internal view props used by server/client wrappers.
 */
export type CheckboxViewProps<T extends string = string> = CheckboxProps<T> & {
  isChecked: boolean
  onChangeInternal?: (event: ChangeEvent<HTMLInputElement>) => void
}
