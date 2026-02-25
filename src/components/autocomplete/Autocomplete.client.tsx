"use client"

import {
  memo,
  type JSX,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { AutocompleteView } from "./Autocomplete.view"

import type {
  AutocompleteItem,
  AutocompleteProps,
  AutocompleteClientState,
} from "./Autocomplete.model"

function AutocompleteClient({
  name,
  value,
  items,
  minQueryLength = 2,
  onChange,
  onSelect,
  ...rest
}: AutocompleteProps): JSX.Element {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [query, setQuery] = useState(value ?? "")
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [listTop, setListTop] = useState<number | undefined>(undefined)

  useEffect(() => {
    setQuery(value ?? "")
  }, [value])

  useEffect(() => {
    if (!open) return

    const onClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    window.addEventListener("mousedown", onClickOutside)
    return () => window.removeEventListener("mousedown", onClickOutside)
  }, [open])

  const list = useMemo(/* istanbul ignore next */ () => items ?? [], [items])

  const updateListAnchor = useCallback(() => {
    const root = rootRef.current
    /* istanbul ignore next */
    if (!root) return

    const inputElement = root.querySelector(
      `input[name="${name}"], textarea[name="${name}"]`,
    ) as HTMLElement | null

    /* istanbul ignore next */
    if (!inputElement) {
      setListTop(undefined)
      return
    }

    /* istanbul ignore next */
    const rootRect = root.getBoundingClientRect()
    /* istanbul ignore next */
    const inputRect = inputElement.getBoundingClientRect()
    /* istanbul ignore next */
    setListTop(inputRect.bottom - rootRect.top)
  }, [name])

  useEffect(() => {
    if (!open) return

    updateListAnchor()

    const onLayoutChange = () => updateListAnchor()

    window.addEventListener("resize", onLayoutChange)
    window.addEventListener("scroll", onLayoutChange, true)

    return () => {
      window.removeEventListener("resize", onLayoutChange)
      window.removeEventListener("scroll", onLayoutChange, true)
    }
  }, [open, query, updateListAnchor])

  const handleInputChange = useCallback(
    (nextQuery: string) => {
      setQuery(nextQuery)
      setOpen(true)
      setActiveIndex(0)
      onChange?.({ query: nextQuery })
    },
    [onChange],
  )

  const handleSelectItem = useCallback(
    (item: AutocompleteItem) => {
      setQuery(item.label)
      setOpen(false)
      onSelect?.(item)
    },
    [onSelect],
  )

  const handleKeyDown = useCallback<
    NonNullable<AutocompleteClientState["onInputKeyDown"]>
  >(
    event => {
      if (event.key === "Escape") {
        setOpen(false)
        return
      }

      if (event.key === "ArrowDown") {
        event.preventDefault()
        setOpen(true)
        setActiveIndex(previous => Math.min(previous + 1, list.length - 1))
        return
      }

      if (event.key === "ArrowUp") {
        event.preventDefault()
        setActiveIndex(previous => Math.max(previous - 1, 0))
        return
      }

      if (event.key === "Enter" && open) {
        event.preventDefault()
        const selected = list[activeIndex]
        if (!selected) return
        handleSelectItem(selected)
      }
    },
    [activeIndex, handleSelectItem, list, open],
  )

  const clientState: AutocompleteClientState = {
    open,
    listTop,
    activeIndex,
    onInputChange: handleInputChange,
    onInputFocus: () => {
      if (query.trim().length >= minQueryLength) setOpen(true)
    },
    onInputKeyDown: handleKeyDown,
    onSelectItem: handleSelectItem,
  }

  return (
    <div ref={rootRef}>
      <AutocompleteView
        {...rest}
        _clientState={clientState}
        items={list}
        minQueryLength={minQueryLength}
        name={name}
        open={open}
        value={query}
      />
    </div>
  )
}

export default memo(AutocompleteClient)
