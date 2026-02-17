import { CheckboxGroupView } from "./CheckboxGroup.view"

import type { CheckboxGroupProps } from "./CheckboxGroup.model"
import type { JSX } from "react"

function toUniqueArray<T extends string>(values?: T[]): T[] {
  if (!Array.isArray(values) || values.length === 0) return []
  return Array.from(new Set(values))
}

export default function CheckboxGroupServer<T extends string>(
  props: CheckboxGroupProps<T>,
): JSX.Element | null {
  const selectedValues = toUniqueArray(props.values ?? props.defaultValues)
  const selectedSet = new Set<T>(selectedValues)

  return (
    <CheckboxGroupView
      {...props}
      isChecked={value => selectedSet.has(value)}
      selectedValues={selectedValues}
    />
  )
}
