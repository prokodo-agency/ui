import { isNull } from "@/helpers/validations"

import type { BaseLinkProps } from "./BaseLink.model"
import type { CSSProperties, JSX } from "react"

const emailRE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

export function BaseLinkView({
  href,
  children,
  disabled,
  style,
  target,
  rel,
  ...restProps
}: BaseLinkProps): JSX.Element {
  /* ------------------------------------------------------------------ */
  /* 1) Decide final href & type                                         */
  let finalHref = href ?? "#"
  let kind: "url" | "email" | "tel" | "local" = "local"

  if (href) {
    const hasProtocol =
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("//")
    const isLocalPath =
      href.startsWith("/") || href.startsWith("#") || href.startsWith("?")
    const appProto = /^\w+:/.test(href) // e.g. mailto:, tel:, sms:, custom://

    if (hasProtocol || appProto) {
      kind = "url"
    } else if (isLocalPath) {
      kind = "local"
    } else if (emailRE.test(href)) {
      kind = "email"
      finalHref = `mailto:${href}`
    } else {
      // Only consider as phone if the WHOLE string looks like a phone, not a path.
      const phoneLikeRE = /^\+?\d[\d\s().-]*$/ // no slashes or letters
      if (phoneLikeRE.test(href)) {
        // normalize to tel:+digits
        const digits = href.replace(/[^\d]/g, "")
        if (digits.length >= 6) {
          kind = "tel"
          finalHref = `tel:+${digits}`
        }
      } else {
        // treat everything else as local (e.g. "admin/users/123")
        kind = "local"
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /* 2) Compute target / rel                                             */
  const computedTarget = target ?? (kind === "url" ? "_blank" : undefined)

  const computedRel =
    rel ?? (kind === "url" ? "noopener noreferrer" : undefined)

  /* 3) Disabled handling                                               */
  const pointerOff: CSSProperties = { pointerEvents: "none" }
  const tabIndex = !isNull(disabled) ? -1 : undefined
  const linkStyle = !isNull(disabled) ? { ...pointerOff, ...style } : style

  /* ------------------------------------------------------------------ */
  /* 4) Render                                                          */
  const { linkComponent, ...aProps } = restProps // strip custom prop

  if (linkComponent) {
    const LinkTag = linkComponent
    return (
      <LinkTag
        href={finalHref}
        rel={computedRel}
        style={linkStyle}
        tabIndex={tabIndex}
        target={computedTarget}
        {...aProps}
      >
        {children}
      </LinkTag>
    )
  }

  return (
    <a
      {...aProps}
      href={finalHref}
      rel={computedRel}
      style={linkStyle}
      tabIndex={tabIndex}
      target={computedTarget}
      download={
        kind === "url" ? (aProps.download as string | undefined) : undefined
      }
    >
      {children}
    </a>
  )
}
