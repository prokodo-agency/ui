"use client"

import {
  memo,
  type JSX,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { TabsView } from "./Tabs.view"

import type { TabsItem, TabsProps } from "./Tabs.model"

function getFirstEnabledIndex<Value extends string>(
  items: TabsItem<Value>[],
): number {
  const index = items.findIndex(item => item.disabled !== true)
  return index >= 0 ? index : 0
}

function getEnabledIndices<Value extends string>(
  items: TabsItem<Value>[],
): number[] {
  return items
    .map((item, index) => ({ item, index }))
    .filter(entry => entry.item.disabled !== true)
    .map(entry => entry.index)
}

function resolveInitialValue<Value extends string>(
  items: TabsItem<Value>[],
  value?: Value,
  defaultValue?: Value,
): Value {
  if (!items.length) {
    return (value ?? defaultValue ?? "") as Value
  }

  const candidate = value ?? defaultValue
  if (candidate !== undefined) {
    const valid = items.find(
      item => item.value === candidate && item.disabled !== true,
    )
    if (valid) return valid.value
  }

  const firstEnabled = items.find(item => item.disabled !== true) ?? items[0]
  return (firstEnabled?.value ?? value ?? defaultValue ?? "") as Value
}

function findIndexByValue<Value extends string>(
  items: TabsItem<Value>[],
  value: Value,
): number {
  const found = items.findIndex(item => item.value === value)
  return found >= 0 ? found : getFirstEnabledIndex(items)
}

function TabsClient<Value extends string = string>({
  items,
  value,
  defaultValue,
  activationMode = "automatic",
  disabled,
  onChange,
  ...rest
}: TabsProps<Value>): JSX.Element {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState<Value>(() =>
    resolveInitialValue(items, value, defaultValue),
  )
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([])

  const activeValue = (isControlled ? value : internalValue) as Value
  const [focusIndex, setFocusIndex] = useState(() =>
    findIndexByValue(items, activeValue),
  )

  useEffect(() => {
    if (isControlled) return
    setInternalValue(resolveInitialValue(items, undefined, defaultValue))
  }, [defaultValue, isControlled, items])

  useEffect(() => {
    setFocusIndex(findIndexByValue(items, activeValue))
  }, [activeValue, items])

  const enabledIndices = useMemo(() => getEnabledIndices(items), [items])

  const selectByIndex = useCallback(
    (index: number) => {
      const next = items[index]
      if (!next || next.disabled === true || disabled === true) return

      if (!isControlled) {
        setInternalValue(next.value)
      }

      onChange?.({
        value: next.value,
        index,
      })
    },
    [disabled, isControlled, items, onChange],
  )

  const moveFocus = useCallback(
    (currentIndex: number, direction: 1 | -1) => {
      if (!enabledIndices.length) return currentIndex

      const currentEnabledPos = enabledIndices.findIndex(
        enabledIndex => enabledIndex === currentIndex,
      )
      const safePosition =
        currentEnabledPos >= 0
          ? currentEnabledPos
          : enabledIndices.findIndex(index => index >= currentIndex)

      const normalizedPosition = safePosition >= 0 ? safePosition : 0
      const nextPosition =
        (normalizedPosition + direction + enabledIndices.length) %
        enabledIndices.length

      return enabledIndices[nextPosition] ?? currentIndex
    },
    [enabledIndices],
  )

  const focusTab = useCallback(
    (index: number) => {
      setFocusIndex(index)
      tabsRef.current[index]?.focus()
    },
    [tabsRef],
  )

  const handleTabClick = useCallback(
    (index: number) => {
      focusTab(index)
      selectByIndex(index)
    },
    [focusTab, selectByIndex],
  )

  const handleTabKeyDown = useCallback(
    (index: number, event: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled === true) return

      const isHorizontal = (rest.orientation ?? "horizontal") === "horizontal"

      if (
        (isHorizontal && event.key === "ArrowRight") ||
        (!isHorizontal && event.key === "ArrowDown")
      ) {
        event.preventDefault()
        const nextIndex = moveFocus(index, 1)
        focusTab(nextIndex)
        if (activationMode === "automatic") {
          selectByIndex(nextIndex)
        }
        return
      }

      if (
        (isHorizontal && event.key === "ArrowLeft") ||
        (!isHorizontal && event.key === "ArrowUp")
      ) {
        event.preventDefault()
        const nextIndex = moveFocus(index, -1)
        focusTab(nextIndex)
        if (activationMode === "automatic") {
          selectByIndex(nextIndex)
        }
        return
      }

      if (event.key === "Home") {
        event.preventDefault()
        const nextIndex = enabledIndices[0] ?? 0
        focusTab(nextIndex)
        if (activationMode === "automatic") {
          selectByIndex(nextIndex)
        }
        return
      }

      if (event.key === "End") {
        event.preventDefault()
        const nextIndex = enabledIndices[enabledIndices.length - 1] ?? 0
        focusTab(nextIndex)
        if (activationMode === "automatic") {
          selectByIndex(nextIndex)
        }
        return
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        selectByIndex(index)
      }
    },
    [
      activationMode,
      disabled,
      enabledIndices,
      focusTab,
      moveFocus,
      rest.orientation,
      selectByIndex,
    ],
  )

  return (
    <TabsView
      {...rest}
      items={items}
      value={activeValue}
      _clientState={{
        activeValue,
        focusIndex,
        tabsRef,
        onTabClick: (index, event) => {
          event.preventDefault()
          handleTabClick(index)
        },
        onTabKeyDown: handleTabKeyDown,
      }}
    />
  )
}

export default memo(TabsClient)
