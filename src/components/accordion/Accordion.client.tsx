"use client"
import { useState, useCallback, type SyntheticEvent    , JSX } from "react"

import { Animated } from "@/components/animated/Animated"
import Button from "@/components/button/Button.client"
import { HeadlineClient as Headline} from "@/components/headline/Headline.client"
import { Icon } from "@/components/icon"

import { AccordionView } from "./Accordion.view"

import type { AccordionProps } from "./Accordion.model"

export default function AccordionClient(props: AccordionProps): JSX.Element {
  const { expanded, onChange, ...rest } = props
  const [expandedIndex, setExpandedIndex] = useState<number | null | undefined>(expanded)

  const handleToggle = useCallback(
    (index: number, e: SyntheticEvent<HTMLDivElement>) => {
      const next = expandedIndex === index ? null : index;
      setExpandedIndex(next);
      onChange?.(index, e, next !== null);
    },
    [expandedIndex, onChange],
  );

  // while hydrating, we reuse Server to avoid attribute mismatch
  return (
    <AccordionView
      {...rest}
      AnimatedComponent={Animated}
      ButtonComponent={Button}
      expandedIndex={expandedIndex}
      HeadlineComponent={Headline}
      IconComponent={Icon}
      onToggle={handleToggle}
    />
  )
}
