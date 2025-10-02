import type { HTMLAttributes, ReactNode } from "react"

export type GridProps = HTMLAttributes<HTMLDivElement> & {
  spacing?: number // The spacing between child elements (applies to container)
  className?: string // Optional class names for custom styling
  children?: ReactNode // Child components or elements
}

export type GridRowProps = HTMLAttributes<HTMLDivElement> & {
  spacing?: number
  align?: "left" | "center" | "right"
  className?: string
  children?: ReactNode
  // Breakpoints
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
}
