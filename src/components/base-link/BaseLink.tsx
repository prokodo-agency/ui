"use client"
import { type FC, type CSSProperties } from "react"

import { isNull } from "@/helpers/validations"

import type { BaseLinkProps } from "./BaseLink.model"

export const BaseLink: FC<BaseLinkProps> = ({
  href,
  children,
  disabled,
  linkComponent: LinkComponent,
  style,
  target,
  rel,
  ...rest
}) => {
  const DISABLE_STYLES: CSSProperties = { pointerEvents: "none" }
  const isAbsolute = href?.startsWith("http")
  const isDownload = rest.download !== undefined
  const isAppUrl = /^\w+:/.test(href)

  const computedTarget = target ?? (isAbsolute ? "_blank" : undefined)
  const computedRel = rel ?? (isAbsolute ? "noopener noreferrer" : undefined)
  const tabIndex = !isNull(disabled) ? -1 : undefined
  const linkStyle = !isNull(disabled) ? { ...DISABLE_STYLES, ...style } : style

  // Use plain <a> for absolute or special URLs
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

  // Internal link with custom component
  return (
    <LinkComponent {...rest} href={href} style={linkStyle} tabIndex={tabIndex}>
      {children}
    </LinkComponent>
  )
}

BaseLink.displayName = "BaseLink"
