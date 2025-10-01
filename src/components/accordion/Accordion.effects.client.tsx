'use client'
import { useEffect } from 'react'

type Flags = {
  /** whether header gradient border sweep is used */
  useBorderShift?: boolean
}

export function AccordionEffectsLoader({ useBorderShift }: Flags): null {
  useEffect(() => {
    if (Boolean(useBorderShift)) {
      void import('./Accordion.effects.module.scss')
    }
  }, [useBorderShift])

  return null
}
