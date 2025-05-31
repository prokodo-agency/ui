import type { HTMLAttributes } from "react"

export type AnimatedTextProps = HTMLAttributes<HTMLSpanElement> & {
  delay?: number
  speed?: number
  disabled?: boolean
  children: string
}

export type AnimatedTextViewProps = Omit<AnimatedTextProps, "children"> & {
  /** the substring actually visible right now */
  text: string
}
