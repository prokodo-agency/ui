import {
  lazy,
  Suspense,
  type ComponentType,
  type FC,
  type ReactElement,
  cloneElement,
} from 'react'

export interface IslandOptions<P extends object> {
  name: string
  Server: ComponentType<P>
  loadLazy: () => Promise<{ default: ComponentType<P & { priority?: boolean }> }>
  isInteractive?: (props: Readonly<P>) => boolean
}

export function createIsland<P extends object>({
  name,
  Server,
  loadLazy,
  isInteractive: customInteractive,
}: IslandOptions<P>): ComponentType<P & { priority?: boolean }> {
  const LazyComp = lazy(() => loadLazy().then((m) => ({ default: m.default })))

  if (typeof window === 'undefined') {
    void loadLazy() // preload on server
  }

    function withIslandAttr(
      el: ReactElement,
      priority?: boolean
    ): ReactElement {
      const islandName = name.toLowerCase()

      if (typeof process !== 'undefined' && typeof process?.env?.PK_ENABLE_DEBUG_LOGS === "string") {
        console.debug(
          `[hydrate] createIsland “${name}” rendering as interactive=${Boolean(
            priority
          )}`
        )
      }

      // 2) Only pass `priority` if truthy:
      const extra: {'data-island': string; priority?: boolean} = { 'data-island': islandName }
      if (Boolean(priority)) {
        extra.priority = priority
      }
      return cloneElement(el as ReactElement, extra)
    }

  const Island: FC<P & { priority?: boolean }> = ({
    priority = false,
    ...raw
  }) => {
    const props = raw as P & { redirect?: unknown }

    const autoInteractive =
      Object.entries(props).some(
        ([k, v]) => k.startsWith('on') && typeof v === 'function',
      ) || props.redirect !== undefined

    const interactive = customInteractive
      ? customInteractive(props) || autoInteractive
      : autoInteractive

    if (interactive && priority) {
      return withIslandAttr(<LazyComp {...props} />)
    }

    if (!interactive) {
      return withIslandAttr(<Server {...props} />)
    }

    const fallback = withIslandAttr(<Server {...props} />)

    return (
      <Suspense fallback={fallback}>
        {withIslandAttr(<LazyComp {...props} />)}
      </Suspense>
    )
  }

  Island.displayName = `${name}Island`
  return Island
}
