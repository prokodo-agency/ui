import { lazy, Suspense, Fragment, type JSX } from 'react'

import ButtonServer from './Button.server'

import type { ButtonProps } from './Button.model'

const LazyWrapper =
  typeof window !== 'undefined'
    ? /* webpackIgnore: true */ lazy(() => import('./Button.lazy'))
    : null;

export const Button = (props: ButtonProps): JSX.Element => {
  const interactive =
    !!props.onClick || !!props.onKeyDown || !!props.redirect;

  if (!interactive) return <ButtonServer {...props} />;
  return (
    <Suspense fallback={<ButtonServer {...props} />}>
      {LazyWrapper ? (
        <LazyWrapper {...props} />
      ) : (
        <Fragment />
      )}
    </Suspense>
  );
};
