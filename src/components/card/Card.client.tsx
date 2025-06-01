"use client"

import {
  useCallback,
  type HTMLAttributes,
  type JSX,
  type KeyboardEvent,
} from "react"

import { isNull } from "@/helpers/validations"

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
  const extra: HTMLAttributes<HTMLDivElement> = isClickable
    ? {
        role: "button",
        tabIndex: !Boolean(disabled) && !isNull(redirect) ? 0 : -1,
      }
    : { tabIndex: -1 }

  return (
    <CardView
      {...rest}
      {...extra}
      disabled={disabled}
      isClickable={isClickable}
      redirect={redirect}
      onClick={!Boolean(disabled) ? handleClickVoid : undefined}
      onKeyDown={handleKey}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  )
}
