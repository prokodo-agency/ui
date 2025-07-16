"use client"

import {
  useState,
  useEffect,
  useCallback,
  memo,
  type ChangeEvent,
  type MouseEvent,
} from "react"

import { isString } from "@/helpers/validations"

import { DynamicListView } from "./DynamicList.view"

import type { DynamicListProps } from "./DynamicList.model"

function DynamicListClient({
  fields,
  value: controlledItems,
  onChange,
  buttonAddProps,
  buttonDeleteProps,
  ...props
}: DynamicListProps) {
  const isSingle = fields.length === 1

  // Internal state if uncontrolled
  type Item = string | Record<string, string>
  const [items, setItems] = useState<Item[]>(() =>
    controlledItems ?? []
  )

  // Sync internal when controlledItems changes
  useEffect(() => {
    if (controlledItems !== undefined) {
      setItems(controlledItems)
    }
  }, [controlledItems])

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement
      const idx   = Number(target.dataset.index)
      const key   = target.dataset.field
      const {value} = target
      if (Number.isNaN(idx) || !isString(key)) return

      const next = items.map((it, i) => {
        if (i !== idx) return it
        return isSingle
          ? value
          : { ...(it as Record<string, string>), [key as string]: value }
      })

      setItems(next)
      onChange?.(next as string[] & Record<string, string>[])
    },
    [items, onChange, isSingle]
  )

  const handleAdd = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const empty = isSingle
        ? ""
        : fields.reduce((obj, f) => {
            obj[f.name] = ""
            return obj
          }, {} as Record<string, string>)

      const next = [...items, empty]
      setItems(next)
      buttonAddProps?.onClick?.(e)
      onChange?.(next as string[] & Record<string, string>[])
    },
    [items, onChange, isSingle, fields, buttonAddProps]
  )

  const handleDelete = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const idx = Number(e.currentTarget.dataset.index)
      if (Number.isNaN(idx)) return

      const next = items.filter((_, i) => i !== idx)

      setItems(next)
      buttonDeleteProps?.onClick?.(e, idx)
      onChange?.(next as string[] & Record<string, string>[])
    },
    [items, onChange, buttonDeleteProps]
  )

  return (
    <DynamicListView
      {...props}
      fields={fields}
      value={items as string[] | Record<string, string>[] | undefined}
      buttonAddProps={{
        ...buttonAddProps,
        onClick: handleAdd,
      }}
      buttonDeleteProps={{
        ...buttonDeleteProps,
        onClick: handleDelete,
      }}
      fieldProps={{
        onChange: handleChange,
      }}
    />
  )
}

export default memo(DynamicListClient)
