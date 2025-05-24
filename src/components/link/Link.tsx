"use client"
import { type FC, memo } from "react"

import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import { BaseLink } from "../base-link"

import styles from "./Link.module.scss"

import type { LinkProps } from "./Link.model"

const bem = create(styles, "Link")

export const Link: FC<LinkProps> = memo(
  ({
    variant = "inherit",
    href,
    children,
    className,
    locale,
    style,
    target,
    itemProp,
    hasBackground,
    onMouseEnter,
    onClick,
    onKeyDown,
    ariaLabel,
  }) => {
    const linkModifier = {
      "has-no-background": hasBackground === false,
      [`has-no-background--${variant}`]: hasBackground === false,
    }
    const defaultProps = {
      className: bem(undefined, linkModifier, className),
      style,
      onMouseEnter,
    }
    if (onClick && !isString(href)) {
      return (
        <span
          aria-label={ariaLabel}
          role="button"
          tabIndex={0}
          onClick={onClick}
          onKeyDown={onKeyDown}
          {...defaultProps}
        >
          {children}
        </span>
      )
    }
    return (
      <BaseLink
        {...defaultProps}
        aria-label={ariaLabel}
        href={href}
        itemProp={itemProp}
        locale={locale}
        target={target ?? undefined}
        onClick={onClick}
      >
        {children}
      </BaseLink>
    )
  },
)

Link.displayName = "Link"
