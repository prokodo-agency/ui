'use client'
import { useEffect } from 'react'

type Flags = {
  /** enable slide in/out keyframes */
  useSlide?: boolean
}

export function DrawerEffectsLoader({ useSlide }: Flags): null {
  useEffect(() => {
    if (Boolean(useSlide)) {
      void import('./Drawer.effects.module.scss')
    }
  }, [useSlide])

  return null
}
