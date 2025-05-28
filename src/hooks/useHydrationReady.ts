import { useEffect, useRef, useState } from 'react'

type Options = {
  enabled?: boolean
}

export function useHydrationReady({ enabled = true }: Options): readonly [boolean, React.RefObject<HTMLDivElement | null>] {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(!enabled)

  useEffect(() => {
    if (enabled === false || visible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting === true) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)

    return () => observer.disconnect()
  }, [enabled, visible])

  return [visible, ref] as const
}
