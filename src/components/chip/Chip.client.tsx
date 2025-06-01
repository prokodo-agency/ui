"use client"

import {
  useCallback,
  type JSX,
  type KeyboardEvent,
  type MouseEvent,
  type HTMLAttributes,
} from "react"

import { ChipView } from "./Chip.view"

import type { ChipProps } from "./Chip.model"

export default function ChipClient(props: ChipProps): JSX.Element {
  const { color, onClick, onKeyDown, onDelete, ...rest } = props

  const clickable = typeof onClick === "function"

  const handleKey = useCallback(
   (e: KeyboardEvent<HTMLDivElement>) => {
     if ((e.key === "Enter" || e.key === " ") && clickable) {
       e.preventDefault()
       onClick?.(e as unknown as MouseEvent<HTMLDivElement>)
     }
     onKeyDown?.(e)
   },
    [clickable, onClick, onKeyDown],
  )

  const handleKeyDelete = useCallback(
   (e: KeyboardEvent<HTMLButtonElement>) => {
     if (e.key === "Enter" || e.key === " ") {
       e.preventDefault()
       onDelete?.(e as unknown as MouseEvent<HTMLButtonElement>)
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
      buttonProps={
        onDelete
          ? { onClick: onDelete, onKeyDown: handleKeyDelete }
          : undefined
      }
      onDelete={onDelete}
      onKeyDown={clickable || onKeyDown ? handleKey : undefined}
    />
  )
}
