"use client"

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  memo,
  type ChangeEvent,
  type MouseEvent,
} from "react"

import { isString } from "@/helpers/validations"

import { DynamicListView } from "./DynamicList.view"

import type {
  DynamicListProps,
  DynamicListField,
  DynamicListFieldInput,
  DynamicListFieldSelect,
} from "./DynamicList.model"
import type { SelectValue, SelectProps } from "@/components/select"

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
  const [items, setItems] = useState<Item[]>(() => controlledItems ?? [])

  // Sync internal when controlledItems changes
  useEffect(() => {
    if (controlledItems !== undefined) {
      setItems(controlledItems)
    }
  }, [controlledItems])

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement
      const idx = Number(target.dataset.index)
      const key = target.dataset.field
      const { value } = target
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
    [items, onChange, isSingle],
  )

  const handleSelectChange = useCallback(
    (idx: number, fieldName: string, v: SelectValue) => {
      const nextValue = Array.isArray(v)
        ? String(v[0] ?? "")
        : v === null
          ? ""
          : String(v)

      const next = items.map((it, i) => {
        if (i !== idx) return it

        if (isSingle) {
          // single-field list: empty string clears the row’s value
          return nextValue === "" ? "" : nextValue
        }

        // multi-field: delete the key when empty string
        const obj = { ...(it as Record<string, string>) }
        if (nextValue === "") {
          delete obj[fieldName]
        } else {
          obj[fieldName] = nextValue
        }
        return obj
      })

      // If you also want to drop rows that become completely empty objects:
      // const compact = next.filter(it => isSingle ? it !== "" : Object.keys(it as Record<string,string>).length > 0);

      setItems(next)
      onChange?.(next as string[] & Record<string, string>[])
    },
    [items, onChange, isSingle],
  )

  const handleAdd = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const empty = isSingle
        ? ""
        : fields.reduce(
            (obj, f) => {
              obj[f?.name ?? ""] = ""
              return obj
            },
            {} as Record<string, string>,
          )

      const next = [...items, empty]
      setItems(next)
      buttonAddProps?.onClick?.(e)
      onChange?.(next as string[] & Record<string, string>[])
    },
    [items, onChange, isSingle, fields, buttonAddProps],
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
    [items, onChange, buttonDeleteProps],
  )

  // Infer Select types safely (avoids importing SelectEvent if not exported)
  type SelectOnChange = NonNullable<SelectProps["onChange"]>
  type SelectEvent = Parameters<SelectOnChange>[0]
  type SelectVal = Parameters<SelectOnChange>[1]

  const formatedFields = useMemo<DynamicListField[]>(
    () =>
      (fields ?? []).map(f => {
        if (f.fieldType === "select") {
          const { ...rest } = f as DynamicListFieldSelect

          // keep Select signature (e, v) close over name read idx from dataset
          const onChange: SelectOnChange = (e: SelectEvent, v: SelectVal) => {
            const idx = Number(
              (e?.target as HTMLSelectElement | null)?.dataset?.index,
            )
            if (!Number.isNaN(idx)) {
              handleSelectChange(idx, rest.name ?? "", v)
            }
          }

          // reassemble as a Select field — no union spread left
          return {
            fieldType: "select",
            ...rest,
            onChange,
          } satisfies DynamicListFieldSelect
        }

        // input branch
        const { ...rest } = f as DynamicListFieldInput
        return {
          fieldType: "input",
          ...rest,
          onChange: handleChange, // matches InputChangeEventHandler
        } satisfies DynamicListFieldInput
      }),
    [fields, handleChange, handleSelectChange],
  )

  return (
    <DynamicListView
      {...props}
      fields={formatedFields}
      value={items as string[] | Record<string, string>[] | undefined}
      buttonAddProps={{
        ...buttonAddProps,
        onClick: handleAdd,
      }}
      buttonDeleteProps={{
        ...buttonDeleteProps,
        onClick: handleDelete,
      }}
    />
  )
}

export default memo(DynamicListClient)
