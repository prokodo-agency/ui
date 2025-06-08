"use client"

import {
  useCallback,
  type JSX,
  type KeyboardEvent,
} from "react"

import { isString } from "@/helpers/validations"

import { CardView } from "./Card.view"

import type { CardProps } from "./Card.model"

export default function CardClient({
  disabled,
  onClick,
  redirect,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: CardProps): JSX.Element {
  const isClickable =
    (!Boolean(disabled) && typeof onClick === "function") ||
    (!!redirect && typeof redirect.href === "string")

  const handleClickVoid = useCallback(() => {
    onClick?.()
  }, [onClick])

  const handleKey = useCallback(
    (e: KeyboardEvent<Element>) => {
      if (e.code === "Enter" && typeof onClick === "function" && !Boolean(disabled)) onClick()
      onKeyDown?.(e)
    },
    [onClick, onKeyDown, disabled],
  )

  const linkRole = isString(redirect?.href) && !Boolean(disabled) ? "link" : undefined
  const linkTabIndex = isString(redirect?.href) && !Boolean(disabled) ? 0 : undefined

  return (
    <CardView
      {...rest}
      disabled={disabled}
      isClickable={isClickable}
      redirect={redirect}
      role={linkRole}
      tabIndex={linkTabIndex}
      onClick={!Boolean(disabled) ? handleClickVoid : undefined}
      onKeyDown={handleKey}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  )
}
