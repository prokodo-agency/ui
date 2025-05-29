import type { CSSProperties } from "react"
import { isNull } from "@/helpers/validations"
import type { BaseLinkProps } from "./BaseLink.model"

export function BaseLinkView({
  href,
  children,
  disabled,
  style,
  target,
  rel,
  linkComponent: _ignored,             // Server kennt keine Func-Props
  ...rest
}: BaseLinkProps) {
  const DISABLE_STYLES: CSSProperties = { pointerEvents: "none" }
  const isAbsolute   = href?.startsWith("http")
  const isDownload   = rest.download !== undefined
  const computedTarget = target ?? (isAbsolute ? "_blank" : undefined)
  const computedRel   = rel ?? (isAbsolute ? "noopener noreferrer" : undefined)
  const tabIndex      = !isNull(disabled) ? -1 : undefined
  const linkStyle = !isNull(disabled) ? { ...DISABLE_STYLES, ...style } : style

  /* Auf dem Server immer <a> – LinkComponent wäre nicht serialisierbar */
  return (
    <a
      {...rest}
      href={href}
      rel={computedRel}
      style={linkStyle}
      tabIndex={tabIndex}
      target={computedTarget}
      download={isDownload ? rest.download as string : undefined}
    >
      {children}
    </a>
  )
}
