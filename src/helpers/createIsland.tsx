/* utils/createIsland.tsx
   ───────────────────────────────────────── */
import {
  lazy,
  Suspense,
  type ComponentType,
  type FC,
  type JSX,
} from 'react';

/* ---------- factory options -------------------------------- */
export interface IslandOptions<P extends object> {
  /** Name used for DevTools & `data-island` marker */
  name: string;
  /** Pure server-only render (no hooks).  */
  Server: ComponentType<P>;
  /** Dynamic import that resolves the *.lazy wrapper. */
  loadLazy: () => Promise<{
    default: ComponentType<P & { priority?: boolean }>;
  }>;
  /**
   * Optional custom predicate that decides whether this
   * set of props needs client interactivity.
   */
  isInteractive?: (props: Readonly<P>) => boolean;
}

/* ---------- helper ---------------------------------------- */
export function createIsland<P extends object>({
  name,
  Server,
  loadLazy,
  isInteractive: customInteractive,
}: IslandOptions<P>): ComponentType<P & { priority?: boolean }> {
  /* Pre-load chunk once (browser only) */
  // if (typeof window !== 'undefined') void loadLazy();

  /* Typed React.lazy wrapper */
  const LazyWrapper =
    typeof window !== 'undefined'
      ? lazy(() => loadLazy().then((m) => ({ default: m.default })))
      : null;

  /* ----------- final entry component ---------------------- */
  const Island: FC<P & { priority?: boolean }> = ({
    priority = false,
    ...raw
  }) => {
    const props = raw as P;

    /* Generic interaction test: any onX handler or redirect prop */
    const autoInteractive =
      Object.entries(props).some(
        ([key, val]) => key.startsWith('on') && typeof val === 'function',
      ) || (props as { redirect?: unknown }).redirect !== undefined;

    const interactive = customInteractive
      ? customInteractive(props) || autoInteractive
      : autoInteractive;

    /* Purely static — stream Server HTML once */
    if (!interactive) return <Server {...props} />;

    /* identical HTML on server & first paint */
    const fallback: JSX.Element = (
      <div data-island={name.toLowerCase()}>
        <Server {...props} />
      </div>
    );

    return (
      <Suspense fallback={fallback}>
        {LazyWrapper ? (
          <LazyWrapper {...props} priority={priority} />
        ) : (
          fallback /* server branch: LazyWrapper === null */
        )}
      </Suspense>
    );
  };

  Island.displayName = `${name}Island`;
  return Island;
}
