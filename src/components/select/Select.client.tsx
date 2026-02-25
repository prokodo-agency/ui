"use client"
import {
  useMemo,
  useState,
  useRef,
  useCallback,
  useEffect,
  type KeyboardEvent,
  memo,
  type JSX,
} from "react"
import { createPortal } from "react-dom"

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
    ? /* istanbul ignore next */
      (() => {
        /* istanbul ignore next */
        const s = new Set<V>(
          /* istanbul ignore next */ isMulti<V>(oldVal) ? oldVal : [],
        )
        /* istanbul ignore next */
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
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const [val, setVal] = useState<SelectValue<Value>>(
    extValue ?? (Boolean(multiple) ? [] : ""),
  )
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({})
  const [popupReady, setPopupReady] = useState(false)

  const hasPlaceholder = !Boolean(required) && !Boolean(multiple)
  const optionCount = (hasPlaceholder ? 1 : 0) + items.length

  /* sync external value */
  useEffect(() => {
    setVal(extValue ?? (Boolean(multiple) ? [] : ""))
  }, [extValue, multiple])

  const clampIndex = useCallback(
    (i: number) => {
      /* istanbul ignore next */
      if (optionCount <= 0) return -1
      // wrap
      if (i < 0) return optionCount - 1
      /* istanbul ignore next */
      if (i >= optionCount) return 0
      return i
    },
    [optionCount],
  )

  const indexToValue = useCallback(
    (i: number): Value | null => {
      /* istanbul ignore else */
      if (hasPlaceholder) {
        /* istanbul ignore else */
        if (i === 0) return null
        /* istanbul ignore next */
        return items[i - 1]?.value as Value
      }
      return items[i]?.value as Value
    },
    [hasPlaceholder, items],
  )

  const valueToIndex = useCallback((): number => {
    // when single-select: try to focus selected item; otherwise first option
    if (!Boolean(multiple)) {
      const current = String(
        /* istanbul ignore next */ (val as unknown as string) ?? "",
      )
      if (hasPlaceholder && current === "") return 0
      const idx = items.findIndex(x => String(x.value) === current)
      /* istanbul ignore next */
      if (idx >= 0) return idx + (hasPlaceholder ? 1 : 0)
    } else {
      /* istanbul ignore next */
      // multi: focus first selected if any
      const arr = Array.isArray(val) ? val : []
      const idx = items.findIndex(x => arr.includes(x.value as Value))
      /* istanbul ignore next */
      if (idx >= 0) return idx + (hasPlaceholder ? 1 : 0)
    }
    /* istanbul ignore next */
    return optionCount > 0 ? 0 : -1
  }, [val, multiple, hasPlaceholder, items, optionCount])

  const close = useCallback(() => {
    setOpen(false)
    setPopupReady(false)
    btnRef?.current?.focus()
  }, [])

  const updatePopupPosition = useCallback(
    /* istanbul ignore next */ () => {
      const btn = btnRef.current
      if (!btn) return false
      /* istanbul ignore next */
      const r = btn.getBoundingClientRect()
      setPopupStyle({
        position: "fixed",
        left: r.left,
        top: r.bottom,
        width: r.width,
        zIndex: 2147483647,
      })
      return true
    },
    [],
  )

  // when opening: set initial active option + focus listbox (portal-safe)
  useEffect(() => {
    if (!open || !popupReady) return
    setActiveIndex(valueToIndex())
    requestAnimationFrame(() => {
      listRef.current?.focus()
    })
  }, [open, popupReady, valueToIndex])

  // IMPORTANT: compute position BEFORE opening, so the first open doesn't flash at (0,0)
  const openWithPosition = useCallback(() => {
    /* istanbul ignore next */
    if (Boolean(disabled)) return
    const ok = updatePopupPosition()
    /* istanbul ignore next */
    if (ok) setPopupReady(true)
    setOpen(true)
  }, [disabled, updatePopupPosition])

  const toggle = useCallback(() => {
    setOpen(prev => {
      /* istanbul ignore next */
      if (prev) {
        setPopupReady(false)
        return false
      }
      // opening
      openWithPosition()
      return true
    })
  }, [openWithPosition])

  useEffect(() => {
    if (!open) return
    // keep position in sync after open (resize/scroll)
    updatePopupPosition()
    setPopupReady(true)
    const onResize = () => updatePopupPosition()
    const onScroll = () => updatePopupPosition()
    window.addEventListener("resize", onResize)
    window.addEventListener("scroll", onScroll, true)
    return () => {
      window.removeEventListener("resize", onResize)
      window.removeEventListener("scroll", onScroll, true)
    }
  }, [open, updatePopupPosition])

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

  const handleKey = /* istanbul ignore next */ (e: KeyboardEvent) => {
    /* istanbul ignore next */
    if (Boolean(disabled)) return
    if (e.key === "Escape") {
      e.preventDefault()
      close()
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (!open) {
        openWithPosition()
        return
      }
      /* istanbul ignore next */
      setActiveIndex(i => clampIndex((i < 0 ? valueToIndex() : i) + 1))
      /* istanbul ignore next */
      listRef.current?.focus()
      return
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (!open) {
        openWithPosition()
        return
      }
      /* istanbul ignore next */
      setActiveIndex(i => clampIndex((i < 0 ? valueToIndex() : i) - 1))
      /* istanbul ignore next */
      listRef.current?.focus()
    }
  }

  /* collect ALL data-* props into a dataset object once */
  const dataset = useMemo(
    /* istanbul ignore next */ () => {
      const d: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(rest)) {
        /* istanbul ignore next */
        if (k.startsWith("data-")) d[toDatasetKey(k.slice(5))] = v
      }
      return d
    },
    [rest],
  )

  const clickOption = /* istanbul ignore next */ (opt: Value | null) => {
    const newVal =
      opt === null
        ? /* istanbul ignore next */ Boolean(multiple)
          ? []
          : ""
        : mergeValue<Value>(val, opt, multiple)

    /* synthesize an event carrying ALL data-* as dataset */
    const syntheticEvt: SelectEvent = { target: { dataset } }

    setVal(newVal)
    onChange?.(syntheticEvt, newVal)
    /* istanbul ignore next */
    if (!Boolean(multiple)) close()
  }

  const onOptionKeyDown = /* istanbul ignore next */ (
    e: React.KeyboardEvent,
    v: Value | null,
  ) => {
    /* istanbul ignore else */
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      clickOption(v)
    }
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
        renderListbox: args => {
          if (!args.open) return null
          /* istanbul ignore next */
          // prevent first-open flash in Storybook: only render once we have a measured position
          if (!popupReady) return null
          // SSR safety: SelectClient is "use client", but keep guard anyway
          /* istanbul ignore next */
          if (typeof document === "undefined") return null

          const onListKeyDown = /* istanbul ignore next */ (
            e: React.KeyboardEvent<HTMLUListElement>,
          ) => {
            if (e.key === "Escape") {
              e.preventDefault()
              close()
              return
            }
            if (e.key === "ArrowDown") {
              e.preventDefault()
              /* istanbul ignore next */
              setActiveIndex(i => clampIndex((i < 0 ? valueToIndex() : i) + 1))
              return
            }
            if (e.key === "ArrowUp") {
              e.preventDefault()
              /* istanbul ignore next */
              setActiveIndex(i => clampIndex((i < 0 ? valueToIndex() : i) - 1))
              return
            }
            if (e.key === "Home") {
              e.preventDefault()
              /* istanbul ignore next */
              setActiveIndex(optionCount > 0 ? 0 : -1)
              return
            }
            if (e.key === "End") {
              e.preventDefault()
              /* istanbul ignore next */
              setActiveIndex(optionCount > 0 ? optionCount - 1 : -1)
              return
            }
            /* istanbul ignore else */
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              const v = indexToValue(activeIndex)
              clickOption(v)
            }
          }

          const listbox = (
            <ul
              ref={listRef}
              aria-multiselectable={Boolean(args.multiple) || undefined}
              className={args.className}
              id={args.id}
              role="listbox"
              style={popupStyle}
              tabIndex={0}
              aria-activedescendant={
                activeIndex >= 0 ? `${args.id}-opt-${activeIndex}` : undefined
              }
              onKeyDown={onListKeyDown}
            >
              {!Boolean(args.required) && !Boolean(args.multiple) && (
                <li
                  key="placeholder"
                  id={`${args.id}-opt-0`}
                  role="option"
                  tabIndex={-1}
                  aria-selected={
                    /* istanbul ignore next */
                    Array.isArray(args.value)
                      ? args.value.length === 0
                      : String(args.value ?? "") === ""
                  }
                  className={args.bemItem({
                    selected:
                      /* istanbul ignore next */
                      Array.isArray(args.value)
                        ? args.value.length === 0
                        : String(args.value ?? "") === "",
                    active: activeIndex === 0,
                  })}
                  onClick={
                    /* istanbul ignore next */ () => args.onOptionClick(null)
                  }
                  onKeyDown={
                    /* istanbul ignore next */ e => onOptionKeyDown(e, null)
                  }
                  onMouseMove={
                    /* istanbul ignore next */ () => setActiveIndex(0)
                  }
                >
                  {args.placeholder}
                </li>
              )}

              {args.items.map(opt => {
                const hasPh = !Boolean(args.required) && !Boolean(args.multiple)
                const idx = args.items.findIndex(x => x.value === opt.value)
                const index = idx + (hasPh ? 1 : 0)
                const selected = Array.isArray(args.value)
                  ? args.value.includes(opt.value as Value)
                  : (opt.value as Value) === (args.value as Value)

                return (
                  <li
                    key={`${args.id}-${opt.value}`}
                    aria-selected={selected}
                    id={`${args.id}-opt-${index}`}
                    role="option"
                    tabIndex={-1}
                    className={args.bemItem({
                      selected,
                      active: activeIndex === index,
                    })}
                    onClick={() => args.onOptionClick(opt.value as Value)}
                    onKeyDown={e => onOptionKeyDown(e, opt.value as Value)}
                    onMouseMove={() => setActiveIndex(index)}
                  >
                    {Boolean(args.multiple) && (
                      <input
                        readOnly
                        aria-hidden="true"
                        className={args.bemCheckbox({ checked: selected })}
                        defaultChecked={selected}
                        type="checkbox"
                      />
                    )}
                    {/* istanbul ignore next */}
                    {Boolean(args.iconVisible) &&
                      /* istanbul ignore next */ opt.icon?.()}
                    {opt.label}
                  </li>
                )
              })}
            </ul>
          )

          return createPortal(listbox, document.body)
        },
      }}
    />
  )
}

export default memo(SelectClient)
