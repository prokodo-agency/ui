"use client"
import { useEffect } from "react"

export function HeadlineEffectsLoader(): null {
  useEffect(() => {
    // lazy import: CSS erst NACH First Paint
    void import("./Headline.effects.module.scss")
  }, [])
  return null
}