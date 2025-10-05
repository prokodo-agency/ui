"use client"
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
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
    step = 1,
    marks = false,
    snap = "none",
  } = props

  // ----- helpers -------------------------------------------------
  const clamp = useCallback(
    (v: number) => Math.min(Math.max(v, min), max),
    [min, max],
  )

  const markValues = useMemo(() => {
    if (Array.isArray(marks)) {
      return [...new Set(marks.map(m => m.value))]
        .filter((v): v is number => typeof v === "number")
        .sort((a, b) => a - b)
    }
    if (marks === true) {
      const pts: number[] = []
      if (step > 0) {
        for (let v = min; v <= max; v += step) pts.push(+v.toFixed(4))
        if (pts.length === 0 || pts[pts.length - 1] !== max) pts.push(max)
      }
      return pts
    }
    return []
  }, [marks, min, max, step])

  const snapToStep = useCallback(
    (v: number) =>
      clamp(step > 0 ? Math.round((v - min) / step) * step + min : v),
    [clamp, step, min],
  )

  const snapToMarks = useCallback(
    (v: number) => {
      const c = clamp(v)
      const arr = markValues
      if (arr.length === 0) return snapToStep(c)
      let best = c,
        bestD = Infinity
      for (const mv of arr) {
        const d = Math.abs(c - mv)
        if (d < bestD) {
          best = mv
          bestD = d
        }
      }
      return clamp(best)
    },
    [clamp, markValues, snapToStep],
  )

  const quantize = useCallback(
    (v: number) => {
      switch (snap) {
        case "step":
          return snapToStep(v)
        case "marks":
          return snapToMarks(v)
        default:
          return clamp(v)
      }
    },
    [snap, snapToMarks, snapToStep, clamp],
  )

  // ----- state & sync -------------------------------------------
  const initial = useMemo(() => {
    const numeric =
      typeof controlledValue === "number"
        ? controlledValue
        : typeof controlledValue === "string"
          ? Number(controlledValue)
          : min
    return quantize(numeric)
  }, [controlledValue, min, quantize])

  const [internalValue, setInternalValue] = useState<number>(initial)

  useEffect(() => {
    if (controlledValue !== undefined) {
      const n =
        typeof controlledValue === "number"
          ? controlledValue
          : typeof controlledValue === "string"
            ? Number(controlledValue)
            : min
      const q = quantize(n)
      setInternalValue(prev => (prev === q ? prev : q))
    }
  }, [controlledValue, min, quantize])

  // ----- events --------------------------------------------------
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    },
    [onFocus],
  )

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    },
    [onBlur],
  )

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = Number(e.currentTarget.value)
      const q = quantize(raw)
      // DIRECT state update — no rAF, no lag, no missed frames
      setInternalValue(prev => (prev === q ? prev : q))
      onChange?.(e, q)
    },
    [onChange, quantize],
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
