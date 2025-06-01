'use client';
import { useLayoutEffect, useRef, useState } from 'react';

export function useHydrationReady(
  opts: { enabled?: boolean; ioOptions?: IntersectionObserverInit } = {},
): readonly [boolean, React.RefObject<HTMLDivElement | null>] {
  const { enabled = true, ioOptions = { threshold: 0.1 } } = opts;
  const ref = useRef<HTMLDivElement | null>(null);

  /* Sync check: already in viewport? */
  const [visible, set] = useState(() => {
    if (!enabled || typeof window === 'undefined') return !enabled;
    const box = ref.current?.getBoundingClientRect();
    return !!box && box.top < window.innerHeight;
  });

  /* Observer for off-screen elements */
  useLayoutEffect(() => {
    if (!enabled || visible) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting === true) {
          set(true);
          io.disconnect();
        }
      },
      { ...ioOptions },
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [enabled, visible, ioOptions]);

  return [visible, ref] as const;
}
