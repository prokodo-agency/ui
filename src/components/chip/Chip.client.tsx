"use client"
import {
  useCallback,
  type JSX,
  type KeyboardEvent,
  type HTMLAttributes,
} from "react"
import { ChipView } from "./Chip.view"
import type { ChipProps } from "./Chip.model"

export default function ChipClient(props: ChipProps): JSX.Element {
  /* 👉 color separat, damit es NICHT im {...rest} landet */
  const { color, onClick, onKeyDown, onDelete, ...rest } = props

  const clickable = typeof onClick === "function"

  const handleKey = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if ((e.key === "Enter" || e.key === " ") && clickable) {
        e.preventDefault()
        onClick?.(e as any)
      }
      onKeyDown?.(e)
    },
    [clickable, onClick, onKeyDown],
  )

  const handleKeyDelete = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onDelete?.(e as any)
      }
    },
    [onDelete],
  )

  const dom: HTMLAttributes<HTMLDivElement> = clickable
    ? { role: "button", tabIndex: 0, onClick }
    : { tabIndex: -1 }

  return (
    <ChipView
      {...rest}
      {...dom}
      color={color}
      onKeyDown={clickable || onKeyDown ? handleKey : undefined}
      onDelete={onDelete}
      buttonProps={
        onDelete
          ? { onClick: onDelete, onKeyDown: handleKeyDelete }
          : undefined
      }
    />
  )
}
