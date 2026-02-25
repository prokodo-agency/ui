import BaseLink from "../base-link/BaseLink.server"

import { LinkView } from "./Link.view"

import type { LinkProps } from "./Link.model"
import type { JSX } from "react"

export default function LinkServer(rawProps: LinkProps): JSX.Element {
  // 🔎 dev guard – help find who still passes linkComponent
  /* istanbul ignore next */
  if (
    process.env.NODE_ENV !== "production" &&
    typeof rawProps?.linkComponent === "function"
  ) {
    console.error(
      "[UI] Do not pass function props (linkComponent) to <Link> on the server. " +
        "Use the UIRuntimeProvider in the parent app instead.",
      rawProps,
    )
  }

  const {
    onClick,
    onKeyDown: _onKeyDown,
    linkComponent: _drop,
    ...props
  } = rawProps
  const hasHandlers = false
  /* istanbul ignore next */
  const linkTag = onClick && !props?.href ? "span" : "a"

  return (
    <LinkView
      {...(props as LinkProps)}
      BaseLinkComponent={BaseLink}
      hasHandlers={hasHandlers}
      LinkTag={linkTag}
    />
  )
}
