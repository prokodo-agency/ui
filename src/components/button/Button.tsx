import { lazy, Suspense, type JSX } from 'react'

import ButtonServer from './Button.server'

import type { ButtonProps } from './Button.model'

const loader = () => import('./Button.lazy')
if (typeof window !== 'undefined') void loader()

const LazyWrapper =
  typeof window !== 'undefined' ? lazy(loader) : null

export function Button(
  { priority, ...props }: ButtonProps,
): JSX.Element {
  const interactive =
    !!props.onClick || !!props.onKeyDown || !!props.redirect

  /* purely static */
  if (!interactive) return <ButtonServer {...props} />

  /* interactive – same HTML on server & client */
  const Child = LazyWrapper ?? ((p: ButtonProps) => <ButtonServer {...p} />)

  return (
    <Suspense fallback={<ButtonServer {...props} />}>
      <Child {...props} priority={priority} />
    </Suspense>
  )
}
