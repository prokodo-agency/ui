/* utils/createIsland.tsx */
import {
  lazy,
  Suspense,
  type ComponentType,
  type FC,
  type ReactNode,
  type JSX,
} from 'react';

export interface IslandOptions<P extends object> {
  name: string;
  Server: ComponentType<P>;
  loadLazy: () => Promise<{ default: ComponentType<P & { priority?: boolean }> }>;
  /** force all instances interactive if truthy */
  isInteractive?: (props: Readonly<P>) => boolean;
}

export function createIsland<P extends object>({
  name,
  Server,
  loadLazy,
  isInteractive: customInteractive,
}: IslandOptions<P>): ComponentType<P & { priority?: boolean }> {
  const LazyComp = lazy(() => loadLazy().then((m) => ({ default: m.default })));

  /* this is how Next knows to preload your chunk:
     a use of loadLazy() on the server side emits <link rel="preload"> */
  if (typeof window === 'undefined') {
    void loadLazy();
  }

  const Wrap: FC<{ children: ReactNode }> = ({ children }) => (
    <div data-island={name.toLowerCase()}>{children}</div>
  );

  const Island: FC<P & { priority?: boolean }> = ({
    priority = false,
    ...raw
  }) => {
    const props = raw as P & { redirect?: unknown };

    // same old “onX or redirect” heuristic
    const autoInteractive =
      Object.entries(props).some(
        ([k, v]) => k.startsWith('on') && typeof v === 'function',
      ) || props.redirect !== undefined;

    // allow custom overrides
    const interactive = customInteractive
      ? customInteractive(props) || autoInteractive
      : autoInteractive;

    // **PRIORITY shortcut**:
    // if this island is marked priority, we skip Suspense entirely
    if (interactive && priority) {
      return (
        <Wrap>
          {/* render the client bundle immediately */}
          <LazyComp {...props} priority={priority} />
        </Wrap>
      );
    }

    // static (no interactivity)
    if (!interactive) {
      return (
        <Wrap>
          <Server {...props} />
        </Wrap>
      );
    }

    // usual lazy/Suspense fallback
    const fallback: JSX.Element = (
      <Wrap>
        <Server {...props} />
      </Wrap>
    );

    return (
      <Suspense fallback={fallback}>
        <Wrap>
          <LazyComp {...props} priority={priority} />
        </Wrap>
      </Suspense>
    );
  };

  Island.displayName = `${name}Island`;
  return Island;
}
