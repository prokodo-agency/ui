"use client"
import {
  useState, useRef, useCallback, useEffect, type KeyboardEvent, memo, type JSX
} from "react"
import { SelectView } from "./Select.view"
import type {
  SelectProps,
  SelectValue,
} from "./Select.model"

/* ---------- helper to normalise outside value ------------ */
function isMulti<V extends string>(v: unknown): v is V[] { return Array.isArray(v) }

function mergeValue<V extends string>(
  oldVal: SelectValue<V>,
  newVal : V,
  multiple = false
): SelectValue<V> {
  return multiple
    ? (() => {
        const s = new Set<V>(isMulti<V>(oldVal) ? oldVal : [])
        s.has(newVal) ? s.delete(newVal) : s.add(newVal)
        return [...s]
      })()
    : newVal
}

function SelectClient<Value extends string = string>(
  {
    id,
    multiple,
    required,
    value: extValue,
    items,
    onChange,
    ...rest
  }: SelectProps<Value>
): JSX.Element {
  const btnRef     = useRef<HTMLButtonElement>(null)
  const listRef    = useRef<HTMLUListElement>(null)
  const [open, setOpen]     = useState(false)
  const [val , setVal] = useState<SelectValue<Value>>(
    extValue ?? (multiple ? [] : "")
  )

  /* sync external value */
  useEffect(() => {
    setVal(extValue ?? (multiple ? [] : ""))
  }, [extValue, multiple])

  const close = useCallback(() => {
    setOpen(false)
    btnRef?.current?.focus()
  },[])
  const toggle = useCallback(() => setOpen(o=>!o),[])

  /* close on outside click */
  useEffect(() => {
    if (!open) return

    const handleOutside = (e: MouseEvent) => {
      if (
        !listRef.current?.contains(e.target as Node) &&
        !btnRef.current?.contains(e.target as Node)
      ) {
        close()
      }
    }

    window.addEventListener("click", handleOutside)
    return () => window.removeEventListener("click", handleOutside)
  }, [open, close])

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault()
      close()
    }
    if (e.key === "ArrowDown" && !open) {
      e.preventDefault()
      setOpen(true)
    }
  }

  const clickOption = (opt: Value | null) => {
    const newVal =
      opt === null
        ? (multiple ? [] : "")
        : mergeValue<Value>(val, opt, multiple)

    setVal(newVal)
    onChange?.(null, newVal)
    if (!multiple) close()
  }

  return (
    <SelectView
      {...rest}
      id={id}
      multiple={multiple}
      required={required}
      value={val as any}
      items={items}
      /* extra, only the client knows */
      _clientState={{
        open,
        buttonRef : btnRef,
        listRef   : listRef,
        onButtonClick : toggle,
        onButtonKey   : handleKey,
        onOptionClick : clickOption,
      }}
    />
  )
}

export default memo(SelectClient)
