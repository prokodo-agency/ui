import type { Variants } from "@/types/variants"
import type {
  MouseEvent,
  KeyboardEvent,
  ReactNode,
  KeyboardEventHandler,
} from "react"

export type ChipVariant = "filled" | "outlined"
export type ChipColor = Variants

export interface ChipProps {
  icon?: ReactNode
  label: ReactNode
  variant?: ChipVariant
  color?: ChipColor
  className?: string

  /** DELETE button click */
  onDelete?: (e: MouseEvent<HTMLButtonElement>) => void

  /** clicking on the chip wrapper */
  onClick?: (e: MouseEvent<HTMLDivElement>) => void

  /** keydown on the chip wrapper */
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void
}

export type ChipViewProps = Omit<ChipProps, "onKeyDown"> & {
  /** the view expects a real React.KeyboardEventHandler<HTMLDivElement> here */
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>
}
