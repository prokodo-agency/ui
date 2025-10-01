'use client'
import { useEffect } from 'react'

type Anim = 'wave' | 'pulse' | 'none' | undefined

export function SkeletonEffectsLoader({ animation }: { animation: Anim }): null {
  useEffect(() => {
    if (animation && animation !== 'none') {
      void import('./Skeleton.effects.module.scss')
    }
  }, [animation])

  return null
}
