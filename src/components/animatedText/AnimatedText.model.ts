import type { HTMLAttributes } from "react"

export type AnimatedTextProps = HTMLAttributes<HTMLSpanElement> & {
  delay?: number
  speed?: number
  disabled?: boolean
  children: string
}
