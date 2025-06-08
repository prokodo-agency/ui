"use client"

import {
  useState,
  useEffect,
  useCallback,
  memo,
  type ChangeEvent,
  type FocusEvent,
} from "react"

import { SliderView } from "./Slider.view"

import type { SliderProps } from "./Slider.model"

function SliderClient(props: SliderProps) {
  const {
    value: controlledValue,
    onChange,
    onFocus,
    onBlur,
    min = 0,
    max = 100,
  } = props

  // Internal numeric state
  // Initialize from controlledValue if provided, else default to min
  const [internalValue, setInternalValue] = useState<number>(() => {
    const numeric =
      typeof controlledValue === "number"
        ? controlledValue
        : typeof controlledValue === "string"
        ? Number(controlledValue)
        : min
    // Clamp to [min, max]
    return Math.min(Math.max(numeric, min), max)
  })

  // Keep internalValue in sync if props.value changes
  useEffect(() => {
    if (controlledValue !== undefined) {
      const numeric =
        typeof controlledValue === "number"
          ? controlledValue
          : typeof controlledValue === "string"
          ? Number(controlledValue)
          : min
      setInternalValue(Math.min(Math.max(numeric, min), max))
    }
  }, [controlledValue, min, max])

  // Track focus state to toggle CSS classes for thumb/value tooltip
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    },
    [onFocus]
  )

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    },
    [onBlur]
  )

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newVal = Number(e.target.value)
      setInternalValue(newVal)
      onChange?.(e, newVal)
    },
    [onChange]
  )

  return (
    <SliderView
      {...props}
      internalValue={internalValue}
      isFocused={isFocused}
      onBlurInternal={handleBlur}
      onChangeInternal={handleChange}
      onFocusInternal={handleFocus}
    />
  )
}

export default memo(SliderClient)
