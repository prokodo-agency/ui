/* utils/createLazyWrapper.tsx
   ------------------------------------------------------------- */
'use client'
import {
  type ComponentType,
  type FC,
  type ReactElement,
} from 'react'

import { useHydrationReady } from '@/hooks/useHydrationReady'

/* ---------- factory options ---------------------------------- */
export interface LazyWrapperOptions<P extends object> {
  /** Display-name for DevTools / data-island marker. */
  name: string
  /** Hydrated client component (full interactivity). */
  Client: ComponentType<P>
  /** Pure server component (identical HTML to entry render). */
  Server: ComponentType<P>
}

/* ---------- helper ------------------------------------------- */
export function createLazyWrapper<P extends object>({
  name,
  Client,
  Server,
}: LazyWrapperOptions<P>): ComponentType<P & { priority?: boolean }> {
  /* ----------- final wrapper component ----------------------- */
  const LazyWrapper: FC<P & { priority?: boolean }> = ({
    priority = false,
    ...raw
  }): ReactElement => {
    /* ----- heuristic: prop-based interaction check ----------- */
    const props = raw as Record<string, unknown> & {
      redirect?: unknown
      onClick?: unknown
      onKeyDown?: unknown
    }

    const hasInteraction =
      typeof props.onClick === 'function' ||
      typeof props.onKeyDown === 'function' ||
      props.redirect !== undefined

    /* -------- viewport / IO gate ----------------------------- */
    const [visible, ref] = useHydrationReady({
      enabled: hasInteraction && !priority,
    })

    /* -------- hydrated branch ------------------------------- */
    if (hasInteraction && (priority || visible)) {
      return <Client {...(raw as P)} />
    }

    /* -------- static placeholder (HTML identical to server) --- */
    return (
      <div ref={ref} data-island={name.toLowerCase()}>
        <Server {...(raw as P)} />
      </div>
    )
  }

  LazyWrapper.displayName = `${name}Lazy`
  return LazyWrapper
}
