"use client"
import { useState, useCallback, type SyntheticEvent, type JSX } from "react"

import { AccordionView } from "./Accordion.view"

import type { AccordionProps } from "./Accordion.model"

export default function AccordionClient(props: AccordionProps): JSX.Element {
  const { expanded, onChange, ...rest } = props
  const [expandedIndex, setExpandedIndex] = useState<number | null | undefined>(
    expanded,
  )

  const handleToggle = useCallback(
    (index: number, e: SyntheticEvent<HTMLDivElement>) => {
      const next = expandedIndex === index ? null : index
      setExpandedIndex(next)
      onChange?.(next !== null ? index : undefined, e, next !== null)
    },
    [expandedIndex, onChange],
  )

  // while hydrating, we reuse Server to avoid attribute mismatch
  return (
    <AccordionView
      {...rest}
      expandedIndex={expandedIndex}
      onToggle={handleToggle}
    />
  )
}
