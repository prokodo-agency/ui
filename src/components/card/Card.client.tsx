"use client"

import {
  useCallback,
  type HTMLAttributes,
  type JSX,
  type KeyboardEvent,
} from "react"
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
    (!disabled && typeof onClick === "function") ||
    (!!redirect && typeof redirect.href === "string")

  const handleClickVoid = useCallback(() => {
    onClick?.()
  }, [onClick])

  const handleKey = useCallback(
    (e: KeyboardEvent<Element>) => {
      if (e.code === "Enter" && onClick && !disabled) onClick()
      onKeyDown?.(e)
    },
    [onClick, onKeyDown, disabled],
  )
  const extra: HTMLAttributes<HTMLDivElement> = isClickable
    ? {
        role: "button",
        tabIndex: !disabled && !redirect ? 0 : -1,
      }
    : { tabIndex: -1 }
      
  return (
    <CardView
      {...rest}
      {...extra}
      isClickable={isClickable}
      disabled={disabled}
      redirect={redirect}
      onClick={!disabled ? handleClickVoid : undefined}
      onKeyDown={handleKey}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  )
}
