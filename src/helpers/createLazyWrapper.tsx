/* utils/createLazyWrapper.tsx */
'use client'
import {
  type ComponentType,
  type FC,
  type ReactElement,
} from 'react'

import { useHydrationReady } from '@/hooks/useHydrationReady'

export interface LazyWrapperOptions<P extends object> {
  name: string
  Client: ComponentType<P>
  Server: ComponentType<P>
  hydrateOnVisible?: boolean
  ioOptions?: IntersectionObserverInit
  /**
   * NEW: override the default “has any onX or redirect” check
   * so you can force hydration even with no handlers.
   */
  isInteractive?: (props: Readonly<P>) => boolean
}

export function createLazyWrapper<P extends object>({
  name,
  Client,
  Server,
  hydrateOnVisible = false,
  ioOptions,
  isInteractive: customInteractive,
}: LazyWrapperOptions<P>): ComponentType<P & { priority?: boolean }> {
  const LazyWrapper: FC<P & { priority?: boolean }> = ({
    priority = false,
    ...raw
  }): ReactElement => {
    const props = raw as Record<string, unknown> & { redirect?: unknown }

    // 1) compute the “auto” heuristic:
    const autoInteractive =
      Object.entries(props).some(
        ([k,v]) => k.startsWith('on') && typeof v === 'function'
      ) ||
      props.redirect !== undefined

    // 2) allow a custom override:
    const interactive = customInteractive
      ? customInteractive(raw as P) || autoInteractive
      : autoInteractive

    // 3) now gate hydration by viewport if requested
    const [visible, ref] = useHydrationReady({
      enabled: interactive && hydrateOnVisible && !priority,
      ...ioOptions,
    })

    // 4) once we know we need interactivity, mount the Client
    if (interactive && (priority || visible)) {
      return <Client {...(raw as P)} />
    }

    // 5) otherwise show the identical Server markup
    return (
      <div ref={ref} data-island={name.toLowerCase()}>
        <Server {...(raw as P)} />
      </div>
    )
  }

  LazyWrapper.displayName = `${name}Lazy`
  return LazyWrapper
}
