import { create } from "@/helpers/bem"
import { BaseLink } from "../base-link"

import styles from "./Link.module.scss"
import type { LinkViewProps } from "./Link.model"
import type { JSX } from "react"

const bem = create(styles, "Link")

export function LinkView({
  variant = "inherit",
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
  onClick,
  linkComponent,
  ...rest
}: LinkViewProps): JSX.Element {
  const linkMod = {
    "has-no-background": hasBackground === false,
    [`has-no-background--${variant}`]: hasBackground === false,
  }

  const common = {
    className: bem(undefined, linkMod, className),
    style,
    "aria-label": ariaLabel,
    itemProp,
  } as const

  if (LinkTag === "span") {
    return (
      <span
        {...common}
        role="button"
        tabIndex={0}
        onClick={hasHandlers ? onClick : undefined}
        onKeyDown={
          hasHandlers
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  (onClick as unknown as (ev: React.SyntheticEvent) => void)?.(e);
                }
              }
            : undefined
        }
        {...rest}
      >
        {children}
      </span>
    )
  }
  return (
    <BaseLink
      {...common}
      {...rest}
      href={href}
      target={target}
      linkComponent={linkComponent}
      {...(hasHandlers ? { onClick } : null)}
    >
      {children}
    </BaseLink>
  )
}
