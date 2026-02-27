/**
 * Docs-safe shim for @prokodo/ui's createIsland helper.
 *
 * The production version (1) calls loadLazy() immediately on the server to
 * preload the chunk, and (2) renders a Suspense+lazy boundary for interactive
 * components.  Both behaviours break Docusaurus SSG:
 *
 *   • The preload triggers require('./Foo.lazy.js') inside the bundled
 *     server.bundle.js — a path that doesn't exist there.
 *   • The Suspense/lazy path also triggers require() when React tries to
 *     render the lazy component during static generation.
 *
 * In documentation we never need client-side interactivity, so this shim
 * always renders the Server variant — no lazy loading, no Suspense.
 */
import { jsx } from 'react/jsx-runtime';
import { cloneElement } from 'react';

function stripFnProps(p) {
  return Object.fromEntries(
    Object.entries(p).filter(([, v]) => typeof v !== 'function'),
  );
}

export function createIsland({ name, Server }) {
  // ⛔  Never call loadLazy() — it breaks Docusaurus SSG.
  // ⛔  Never use React.lazy / Suspense — also breaks SSG via require().

  function withIslandAttr(el) {
    return cloneElement(el, { 'data-island': name.toLowerCase() });
  }

  const Island = ({ priority = false, ...raw }) => {
    const props = raw;
    const serverBaseProps =
      name === 'Image' && priority ? { ...props, priority } : props;
    const serverSafe = stripFnProps(serverBaseProps);
    // Always render the server (static) variant in docs.
    return withIslandAttr(jsx(Server, { ...serverSafe }));
  };

  Island.displayName = `${name}Island`;
  return Island;
}
