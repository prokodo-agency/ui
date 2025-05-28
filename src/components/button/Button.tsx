import { lazy, Suspense, type JSX } from 'react';

import ButtonServer from './Button.server';

import type { ButtonProps } from './Button.model';

const loader = () => import('./Button.lazy');
if (typeof window !== 'undefined') void loader();

const LazyWrapper =
  typeof window !== 'undefined' ? lazy(loader) : null;

export function Button({ priority = false, ...props }: ButtonProps): JSX.Element {
  const interactive =
    !!props.onClick || !!props.onKeyDown || !!props.redirect;

  if (!interactive) return <ButtonServer {...props} />;

  const Fallback = (
    <div data-island="button">
      <ButtonServer {...props} />
    </div>
  );

  return (
    <Suspense fallback={Fallback}>
      {LazyWrapper ? (
        <LazyWrapper {...props} priority={priority} />
      ) : (
        <></>
      )}
    </Suspense>
  );
}
