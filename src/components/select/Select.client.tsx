"use client"
import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type KeyboardEvent,
  memo,
  type JSX,
} from "react"

import { SelectView } from "./Select.view"

import type { SelectProps, SelectEvent, SelectValue } from "./Select.model"

/* ---------- helper to normalise outside value ------------ */
function isMulti<V extends string>(v: unknown): v is V[] {
  return Array.isArray(v)
}
/* convert kebab to camel (e.g., "row-index" -> "rowIndex") like DOM dataset does */
const toDatasetKey = (k: string) =>
  k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())

function mergeValue<V extends string>(
  oldVal: SelectValue<V>,
  newVal: V,
  multiple = false,
): SelectValue<V> {
  return multiple
    ? (() => {
        const s = new Set<V>(isMulti<V>(oldVal) ? oldVal : [])
        s.has(newVal) ? s.delete(newVal) : s.add(newVal)
        return [...s]
      })()
    : newVal
}

function SelectClient<Value extends string = string>({
  id,
  multiple,
  disabled,
  required,
  value: extValue,
  items,
  onChange,
  ...rest
}: SelectProps<Value>): JSX.Element {
  const btnRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState(false)
  const [val, setVal] = useState<SelectValue<Value>>(
    extValue ?? (Boolean(multiple) ? [] : ""),
  )

  /* sync external value */
  useEffect(() => {
    setVal(extValue ?? (Boolean(multiple) ? [] : ""))
  }, [extValue, multiple])

  const close = useCallback(() => {
    setOpen(false)
    btnRef?.current?.focus()
  }, [])
  const toggle = useCallback(() => setOpen(o => !o), [])

  /* close on outside click */
  useEffect(() => {
    if (!open) return

    const handleOutside = (e: MouseEvent) => {
      if (
        !Boolean(listRef.current?.contains(e.target as Node)) &&
        !Boolean(btnRef.current?.contains(e.target as Node))
      ) {
        close()
      }
    }

    window.addEventListener("click", handleOutside)
    return () => window.removeEventListener("click", handleOutside)
  }, [open, close])

  const handleKey = (e: KeyboardEvent) => {
    if (Boolean(disabled)) return
    if (e.key === "Escape") {
      e.preventDefault()
      close()
    }
    if (e.key === "ArrowDown" && !open) {
      e.preventDefault()
      setOpen(true)
    }
  }

  /* collect ALL data-* props into a dataset object once */
  const dataset = (() => {
    const d: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(rest)) {
      if (k.startsWith("data-")) d[toDatasetKey(k.slice(5))] = v
    }
    return d
  })()

  const clickOption = (opt: Value | null) => {
    const newVal =
      opt === null
        ? Boolean(multiple)
          ? []
          : ""
        : mergeValue<Value>(val, opt, multiple)

    /* synthesize an event carrying ALL data-* as dataset */
    const syntheticEvt: SelectEvent = { target: { dataset } }

    setVal(newVal)
    onChange?.(syntheticEvt, newVal)
    if (!Boolean(multiple)) close()
  }

  return (
    <SelectView
      {...rest}
      /* extra, only the client knows */
      disabled={disabled}
      id={id}
      items={items}
      multiple={multiple}
      required={required}
      value={val as Value}
      _clientState={{
        open,
        buttonRef: btnRef,
        listRef: listRef,
        onButtonClick: toggle,
        onButtonKey: handleKey,
        onOptionClick: clickOption,
      }}
    />
  )
}

export default memo(SelectClient)
