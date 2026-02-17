"use client"
import { memo, useCallback, useEffect, useMemo, useState } from "react"

import { CheckboxGroupView } from "./CheckboxGroup.view"

import type { CheckboxGroupProps } from "./CheckboxGroup.model"

function toUniqueArray<T extends string>(values?: T[]): T[] {
  if (!Array.isArray(values) || values.length === 0) return []
  return Array.from(new Set(values))
}

function CheckboxGroupClient<T extends string>(props: CheckboxGroupProps<T>) {
  const { values, defaultValues, onChange } = props

  const [selectedValues, setSelectedValues] = useState<T[]>(() =>
    toUniqueArray(values ?? defaultValues),
  )

  useEffect(() => {
    if (Array.isArray(values)) {
      setSelectedValues(toUniqueArray(values))
    }
  }, [values])

  const selectedSet = useMemo(
    () => new Set<T>(selectedValues),
    [selectedValues],
  )

  const isChecked = useCallback(
    (value: T) => selectedSet.has(value),
    [selectedSet],
  )

  const onToggle = useCallback(
    (value: T) => {
      setSelectedValues(prev => {
        const nextSet = new Set(prev)
        if (nextSet.has(value)) nextSet.delete(value)
        else nextSet.add(value)

        const next = Array.from(nextSet)
        onChange?.(next)
        return next
      })
    },
    [onChange],
  )

  return (
    <CheckboxGroupView
      {...props}
      isChecked={isChecked}
      selectedValues={selectedValues}
      onToggle={onToggle}
    />
  )
}

export default memo(CheckboxGroupClient) as typeof CheckboxGroupClient
