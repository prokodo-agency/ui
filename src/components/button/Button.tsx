import { lazy, Suspense, type JSX } from 'react'

import ButtonServer from './Button.server'

import type { ButtonProps } from './Button.model'

/* ---------- preload chunk once ---------- */
const preload = () => import('./Button.lazy')
if (typeof window !== 'undefined') void preload()

/* ---------- typed lazy wrapper ---------- */
const LazyWrapper =
  typeof window !== 'undefined'
    ? lazy(() =>
        preload().then((m) => ({ default: m.default })), // <- adapter
      )
    : null

/* ---------------------------------------- */

export function Button({ priority = false, ...props }: ButtonProps): JSX.Element {
  const interactive =
    !!props.onClick || !!props.onKeyDown || !!props.redirect

  if (!interactive) return <ButtonServer {...props} />

  /* identical wrapper div on server & first paint */
  const Fallback = (
    <div data-island="button">
      <ButtonServer {...props} />
    </div>
  )

  return (
    <Suspense fallback={Fallback}>
      {LazyWrapper ? (
        <LazyWrapper {...props} priority={priority} />
      ) : (
        Fallback /* server branch renders the same HTML */
      )}
    </Suspense>
  )
}
