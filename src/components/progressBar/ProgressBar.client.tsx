"use client"
import { useEffect, useRef, useState, type JSX } from "react"

import { ProgressBarView } from "./ProgressBar.view"

import type { ProgressBarProps } from "./ProgressBar.model"

/**
 * Adds a smooth counting animation from the previous value to the next.
 * If `animated` is false, value jumps immediately.
 */
export default function ProgressBarClient(
  props: ProgressBarProps,
): JSX.Element {
  /* istanbul ignore next */
  const { value, animated = true, ...rest } = props
  const [displayValue, setDisplayValue] = useState(value)
  const frame = useRef<number>(null)

  useEffect(() => {
    if (!animated || value === undefined) {
      setDisplayValue(value)
      return
    }

    /* istanbul ignore next */
    const start = displayValue ?? 0
    const end = value
    const duration = 400 // ms
    const startTime = performance.now()

    const step = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration)
      const next = start + (end - start) * progress
      setDisplayValue(next)
      if (progress < 1) frame.current = requestAnimationFrame(step)
    }

    frame.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame.current!)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, animated])

  return <ProgressBarView {...rest} value={displayValue} />
}
