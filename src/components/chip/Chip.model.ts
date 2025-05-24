import type { Variants } from "@/types/variants"
import type { MouseEventHandler, KeyboardEventHandler, ReactNode } from "react"

export type ChipVariant = "filled" | "outlined"
export type ChipColor = Variants

export interface ChipProps {
  icon?: ReactNode
  label: ReactNode
  variant?: ChipVariant
  color?: ChipColor
  className?: string
  onDelete?: MouseEventHandler<HTMLButtonElement>
  onClick?: MouseEventHandler<HTMLDivElement>
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>
}
