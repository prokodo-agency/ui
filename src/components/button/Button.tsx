import { lazy, Suspense, Fragment, type JSX } from 'react'

import ButtonServer from './Button.server'

import type { ButtonProps } from './Button.model'

// --- client-only bundle loader ---------------------------------
const loader = () => import('./Button.lazy')      // 1. async chunk

// preload the chunk *once* (browser only)
if (typeof window !== 'undefined') void loader()          // 2. cache warm-up

// wrap with React.lazy (also browser only)
const LazyWrapper =
  typeof window !== 'undefined' ? lazy(loader) : null
// ----------------------------------------------------------------

export function Button({ priority, ...props }: ButtonProps): JSX.Element {
  const interactive =
    !!props.onClick || !!props.onKeyDown || !!props.redirect

  /* 100 % static: render & done */
  if (!interactive) return <ButtonServer {...props} />

  /* Interactive: identical markup on server + client = ☑ no mismatch */
  return (
    <Suspense fallback={<ButtonServer {...props} />}>
      {LazyWrapper ? <LazyWrapper {...props} priority={priority} /> : <Fragment />}
    </Suspense>
  )
}
