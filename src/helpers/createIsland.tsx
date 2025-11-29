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

  function withIslandAttr(el: ReactElement): ReactElement {
    const islandName = name.toLowerCase()
    // TS doesn’t know about arbitrary data-* on cloneElement → cast to any
    return cloneElement(
      el as ReactElement,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { "data-island": islandName } as any,
    )
  }

  const Island: FC<P & { priority?: boolean }> = ({
    priority = false,
    ...raw
  }) => {
    // props WITHOUT priority (used for Server + interactivity heuristic)
    const props = raw as P & { redirect?: unknown }

    const serverBaseProps =
      name === "Image" && priority
        ? ({
            ...props,
            priority,
          } as P & { priority?: boolean })
        : (props as P)

    // Heuristic: if any prop is a function (onClick, onKeyDown, …) or a redirect flag,
    // we consider it interactive.
    const autoInteractive =
      Object.entries(props).some(
        ([k, v]) => k.startsWith("on") && typeof v === "function",
      ) || props.redirect !== undefined

    const interactive = customInteractive
      ? customInteractive(props) || autoInteractive
      : autoInteractive

    // Never send function props to a Server Component:
    const serverSafe = stripFnProps(serverBaseProps as Record<string, unknown>)

    // Prepare props for the lazy client component (it *can* see `priority`)
    const clientProps: P & { priority?: boolean } = priority
      ? ({ ...props, priority } as P & { priority?: boolean })
      : ({ ...props } as P & { priority?: boolean })

    // Non-interactive: always render Server-only fallback
    if (!interactive) {
      return withIslandAttr(<Server {...(serverSafe as P)} />)
    }

    // Interactive: Server fallback + lazy client
    const fallback = withIslandAttr(<Server {...(serverSafe as P)} />)

    return (
      <Suspense fallback={fallback}>
        {/* Client path: pass original props (+ priority) to lazy wrapper */}
        {withIslandAttr(<LazyComp {...clientProps} />)}
      </Suspense>
    )
  }

  Island.displayName = `${name}Island`
  return Island
}
