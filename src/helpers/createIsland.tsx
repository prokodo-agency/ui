import {
  lazy,
  Suspense,
  type ComponentType,
  type FC,
  type ReactElement,
  cloneElement,
} from "react"

export interface IslandOptions<P extends object> {
  name: string
  Server: ComponentType<P>
  loadLazy: () => Promise<{
    default: ComponentType<P & { priority?: boolean }>
  }>
  isInteractive?: (props: Readonly<P>) => boolean
}

// Strip function-typed props for server-only fallback renders
function stripFnProps<T extends Record<string, unknown>>(p: T): T {
  return Object.fromEntries(
    Object.entries(p).filter(([, v]) => typeof v !== "function"),
  ) as T
}

export function createIsland<P extends object>({
  name,
  Server,
  loadLazy,
  isInteractive: customInteractive,
}: IslandOptions<P>): ComponentType<P & { priority?: boolean }> {
  const LazyComp = lazy(() => loadLazy().then(m => ({ default: m.default })))

  // Preload code on the server to improve TTFB when hydrating on client
  if (typeof window === "undefined") {
    void loadLazy()
  }

  function withIslandAttr(el: ReactElement, priority?: boolean): ReactElement {
    const islandName = name.toLowerCase()
    const extra: { "data-island": string; priority?: boolean } = {
      "data-island": islandName,
    }
    if (Boolean(priority)) extra.priority = true
    return cloneElement(el as ReactElement, extra)
  }

  const Island: FC<P & { priority?: boolean }> = ({ ...raw }) => {
    const props = raw as P & { redirect?: unknown }

    // Heuristic: if any prop is a function (onClick, onKeyDown, …) or a redirect flag,
    // we consider it interactive.
    const autoInteractive =
      Object.entries(props).some(
        ([k, v]) => k.startsWith("on") && typeof v === "function",
      ) || props.redirect !== undefined

    const interactive = customInteractive
      ? customInteractive(props) || autoInteractive
      : autoInteractive

    // 🚫 Never send function props to a Server Component:
    const serverSafe = stripFnProps(props)

    // SSR path should *not* render the client bundle directly with function props.
    // We always use a Server fallback on the server, and let the browser hydrate to client.
    if (!interactive) {
      return withIslandAttr(<Server {...(serverSafe as P)} />)
    }

    const fallback = withIslandAttr(<Server {...(serverSafe as P)} />)

    return (
      <Suspense fallback={fallback}>
        {/* ✅ Client path: pass ORIGINAL props (incl. handlers) */}
        {withIslandAttr(<LazyComp {...(props as P)} />)}
      </Suspense>
    )
  }

  Island.displayName = `${name}Island`
  return Island
}
