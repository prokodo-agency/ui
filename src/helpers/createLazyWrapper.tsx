'use client'
import {
  type ComponentType,
  type ReactElement,
  type FC,
  cloneElement,
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

    const autoInteractive =
      Object.entries(props).some(
        ([k, v]) => k.startsWith('on') && typeof v === 'function',
      ) ||
      props.redirect !== undefined

    const interactive = customInteractive
      ? customInteractive(props) || autoInteractive
      : autoInteractive

    const [visible, ref] = useHydrationReady({
      enabled: interactive && hydrateOnVisible && !priority,
      ...ioOptions,
    })

    const islandName = name.toLowerCase()

    if (interactive && (priority || visible)) {
      const clientEl = <Client {...props} />
      // 1) log which lazy wrapper is rendering:
      if (typeof process !== 'undefined' && typeof process?.env?.PK_ENABLE_DEBUG_LOGS === "string") {
        console.debug(
          `[hydrate] createLazyWrapper “${name}” rendering client (priority=${Boolean(
            priority
          )}, visible=${visible})`
        )
      }

      // 2) only pass priority when true:
      const extra: {'data-island': string; priority?: boolean} = { 'data-island': islandName }
      if (priority) {
        extra.priority = priority
      }
      return cloneElement(clientEl as ReactElement, extra)
    } else {
      const serverEl = <Server {...props} />
      if (typeof process !== 'undefined' && typeof process?.env?.PK_ENABLE_DEBUG_LOGS === "string") {
      // 1) log which lazy wrapper is rendering server:
        console.debug(
          `[hydrate] createLazyWrapper “${name}” rendering server (visible=${visible})`
        )
      }

      // 2) always attach data-island  ref when rendering server
      return cloneElement(
        serverEl as ReactElement,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { 'data-island': islandName, ref } as any
      )
    }
  }

  LazyWrapper.displayName = `${name}Lazy`
  return LazyWrapper
}
