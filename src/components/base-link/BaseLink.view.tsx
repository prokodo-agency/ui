import { isNull } from "@/helpers/validations"

import type { BaseLinkProps } from "./BaseLink.model"
import type { CSSProperties, JSX } from "react"

export function BaseLinkView({
  href,
  children,
  disabled,
  style,
  target,
  rel,
  ...props
}: BaseLinkProps): JSX.Element {
  const { ...rest } = props
  delete rest.linkComponent
  const DISABLE_STYLES: CSSProperties = { pointerEvents: "none" }
  const isAbsolute   = href?.startsWith("http")
  const isDownload   = rest.download !== undefined
  const computedTarget = target ?? (isAbsolute ? "_blank" : undefined)
  const computedRel   = rel ?? (isAbsolute ? "noopener noreferrer" : undefined)
  const tabIndex      = !isNull(disabled) ? -1 : undefined
  const linkStyle = !isNull(disabled) ? { ...DISABLE_STYLES, ...style } : style
  return (
    <a
      {...rest}
      download={isDownload ? rest.download as string : undefined}
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
