import { LinkView } from './Link.view';

import type { LinkProps } from './Link.model';
import type { JSX } from "react"

export default function LinkServer(props: LinkProps): JSX.Element {
  const hasHandlers = false;          // server never attaches JS handlers
  const linkTag = props.onClick && !props.href ? 'span' : 'a';
  return (
    <LinkView
      {...props}
      hasHandlers={hasHandlers}
      LinkTag={linkTag}
    />
  );
}
