'use client'
import { useLayoutEffect, useRef, useState } from 'react'

export type UseHydrationReadyOptions = {
  enabled?: boolean
  threshold?: number
}

export function useHydrationReady(
  opts: UseHydrationReadyOptions = {},
): readonly [boolean, React.RefObject<HTMLDivElement | null>] {
  const { enabled = true, threshold = 0.1 } = opts
  const ref = useRef<HTMLDivElement | null>(null)

  /* ① sync check: already inside first viewport? */
  const [visible, setVisible] = useState(() => {
    if (!enabled || typeof window === 'undefined') return !enabled
    const box = ref.current?.getBoundingClientRect()
    return !!box && box.top < window.innerHeight
  })

  /* ② async observer for off-screen elements */
  useLayoutEffect(() => {
    if (!enabled || visible) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting === true) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [enabled, visible, threshold])

  return [visible, ref] as const
}
