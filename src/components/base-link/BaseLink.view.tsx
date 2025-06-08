import { isNull } from "@/helpers/validations";

import type { BaseLinkProps } from "./BaseLink.model";
import type { CSSProperties, JSX } from "react";

const emailRE =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

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
  let finalHref = href ?? "#";
  let kind: "url" | "email" | "tel" | "local" = "local";

  if (href) {
    if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//")) {
      kind = "url";
    } else if (emailRE.test(href)) {
      kind = "email";
      finalHref = `mailto:${href.toLowerCase()}`;
    } else {
      /* phone? */
      const digits = href.replace(/[^\d]/g, "");
      if (digits.length >= 6) {
        kind = "tel";
        finalHref = `tel:${digits.startsWith("00")
          ? `+${digits.slice(2)}`
          : digits.startsWith("0")
          ? `+${digits.slice(1)}`
          : `+${digits}`}`;
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /* 2) Compute target / rel                                             */
  const computedTarget =
    target ?? (kind === "url" ? "_blank" : undefined);

  const computedRel =
    rel ?? (kind === "url" ? "noopener noreferrer" : undefined);

  /* 3) Disabled handling                                               */
  const pointerOff: CSSProperties = { pointerEvents: "none" };
  const tabIndex = !isNull(disabled) ? -1 : undefined;
  const linkStyle =
    !isNull(disabled) ? { ...pointerOff, ...style } : style;

  /* ------------------------------------------------------------------ */
  /* 4) Render                                                          */
  const { linkComponent, ...aProps } = restProps; // strip custom prop

  if (linkComponent) {
    const LinkTag = linkComponent;
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
    );
  }

  return (
    <a
      {...aProps}
      download={kind === "url" ? aProps.download as string | undefined : undefined}
      href={finalHref}
      rel={computedRel}
      style={linkStyle}
      tabIndex={tabIndex}
      target={computedTarget}
    >
      {children}
    </a>
  );
}
