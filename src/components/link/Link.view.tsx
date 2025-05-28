import { create } from '@/helpers/bem';

import { BaseLink } from '../base-link';

import styles from './Link.module.scss';

import type { LinkViewProps } from './Link.model';
import type { JSX } from "react"

const bem = create(styles, 'Link');

export function LinkView({
  variant = 'inherit',
  href,
  children,
  className,
  style,
  target,
  itemProp,
  hasBackground,
  ariaLabel,
  LinkTag,
  hasHandlers,
  ...rest
}: LinkViewProps): JSX.Element {
  const linkMod = {
    'has-no-background': hasBackground === false,
    [`has-no-background--${variant}`]: hasBackground === false,
  };

  const common = {
    className: bem(undefined, linkMod, className),
    style,
    'aria-label': ariaLabel,
    itemProp,
  };

  return LinkTag === 'span' ? (
    <span
      {...common}
      role="button"
      tabIndex={0}
      {...rest} /* onClick / onKeyDown forwarded only in client */
    >
      {children}
    </span>
  ) : (
    <BaseLink
      {...common}
      href={href}
      target={target ?? undefined}
      {...(hasHandlers ? { onClick: rest?.onClick } : null)}
    >
      {children}
    </BaseLink>
  );
}
