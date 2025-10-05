"use client"
import { useEffect } from "react"

type Flags = {
  useReveal?: boolean
  useHighlight?: boolean
  useGradient?: boolean
}

export function CardEffectsLoader({
  useReveal,
  useHighlight,
  useGradient,
}: Flags): null {
  useEffect(() => {
    // Only import if any effect is actually needed
    if (Boolean(useReveal) || Boolean(useHighlight) || Boolean(useGradient)) {
      void import("./Card.effects.module.scss")
    }
  }, [useReveal, useHighlight, useGradient])

  return null
}
