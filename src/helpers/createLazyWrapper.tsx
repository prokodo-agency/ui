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
  // When it makes sense to use hydrateOnVisible:
  // - Below‐the‐fold widgets: If you have a heavy interactive area (e.g. a map widget, data‐visualization, large form,
  //   or complex carousel) that appears well down the page, you can save initial JS work by waiting until the user scrolls there.
  // - Rarely used controls: Think of a settings panel or user menu that sits hidden until triggered—hydrating it only
  // on first visibility reduces wasted work.
  hydrateOnVisible?: boolean
  ioOptions?: IntersectionObserverInit
  // When to use isInteractive:
  // - If your component never receives any “onX” callbacks at all, but still needs client-only logic—for example, a
  // tooltip that opens on hover or a carousel that auto-rotates. Since there is no prop named onX, the wrapper would assume “static,”
  // unless you force isInteractive: () => true.
  // - If you want to force hydration even when the consumer forgot to supply an onChange (or any “onX”). In that case,
  // isInteractive: () => true guarantees the client bundle always loads.
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
