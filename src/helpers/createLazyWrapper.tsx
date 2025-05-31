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
    const props = raw as P & { redirect?: unknown }

    // 1) “auto” heuristic
    const autoInteractive =
      Object.entries(props).some(
        ([k, v]) => k.startsWith('on') && typeof v === 'function',
      ) ||
      props.redirect !== undefined

    // 2) optional override
    const interactive = customInteractive
      ? customInteractive(props) || autoInteractive
      : autoInteractive

    // 3) intersection-observer flag
    const [visible, ref] = useHydrationReady({
      enabled: interactive && hydrateOnVisible && !priority,
      ...ioOptions,
    })

    // 4) single wrapper around both branches:
    return (
      <div ref={ref} data-island={name.toLowerCase()}>
        {interactive && (priority || visible)
          ? <Client {...props} />
          : <Server {...props} />}
      </div>
    )
  }

  LazyWrapper.displayName = `${name}Lazy`
  return LazyWrapper
}
