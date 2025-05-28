import { lazy, Suspense, type JSX } from 'react'

import ButtonStatic from './Button.server'

import type { ButtonProps } from './Button.model'

const LazyWrapper =
  typeof window !== 'undefined'
    ? lazy(() => import('./Button.lazy'))
    : null

export const Button = (props: ButtonProps): JSX.Element => {
  const interactive =
    !!props.onClick || !!props.onKeyDown || !!props.redirect

  if (interactive && LazyWrapper) {
    return (
      <Suspense fallback={<ButtonStatic {...props} />}>
        <LazyWrapper {...props} />
      </Suspense>
    )
  }

  return <ButtonStatic {...props} />
}
