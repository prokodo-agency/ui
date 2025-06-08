"use client"

import { isNull } from "@/helpers/validations"

import type { BaseLinkProps } from "./BaseLink.model"
import type { CSSProperties, JSX } from "react"

export default function BaseLinkClient({
  href,
  children,
  disabled,
  linkComponent: LinkComponent,
  style,
  target,
  rel,
  ...rest
}: BaseLinkProps): JSX.Element {
  const DISABLE: CSSProperties = { pointerEvents: "none" }
  const isAbsolute  = href?.startsWith("http")
  const isDownload  = rest.download !== undefined
  const isAppUrl    = /^\w+:/.test(href)

  const computedTarget = target ?? (isAbsolute ? "_blank" : undefined)
  const computedRel    = rel ?? (isAbsolute ? "noopener noreferrer" : undefined)
  const tabIndex       = !isNull(disabled) ? -1 : undefined
  const linkStyle      = !isNull(disabled) ? { ...DISABLE, ...style } : style

  if (isAbsolute || isDownload || isAppUrl || LinkComponent === undefined) {
    return (
      <a
        {...rest}
        href={href}
        rel={computedRel}
        style={linkStyle}
        tabIndex={tabIndex}
        target={computedTarget}
      >
        {children}
      </a>
    )
  }

  return (
    <LinkComponent {...rest} href={href} style={linkStyle} tabIndex={tabIndex}>
      {children}
    </LinkComponent>
  )
}
