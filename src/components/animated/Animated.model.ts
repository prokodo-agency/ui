import type { ReactNode, RefObject } from "react"

export type AnimatedProps = {
  ref?: RefObject<HTMLDivElement>
  className?: string
  disabled?: boolean
  animation?: "bottom-top" | "top-bottom" | "left-right" | "right-left"
  delay?: number
  threshold?: number
  speed?: "fast" | "slow"
  children?: ReactNode
  intersectionObserverOptions?: IntersectionObserverInit
  onAnimate?: (visible: boolean) => void
}

export interface AnimatedViewProps
  extends Omit<AnimatedProps, 'delay' | 'intersectionObserverOptions' | 'onAnimate'> {
  /** actual visible state */
  isVisible: boolean;
}
