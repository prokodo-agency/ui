import { forwardRef } from "react"

import { create } from "@/helpers/bem"

import styles from "./Animated.module.scss"

import type { AnimatedViewProps } from "./Animated.model"

const bem = create(styles, "Animated")

export const AnimatedView = forwardRef<HTMLDivElement, AnimatedViewProps>(
  ({ className, disabled = false, speed = "normal", animation = "fade-in", isVisible, children, ...domRest }, ref) => (
      <div
        ref={ref}
        className={bem(
          undefined,
          {
            "is-visible": isVisible,
            "is-disabled": disabled,
            [`has-${speed}-speed`]: !!speed,
            [`animate-${animation}`]: !!animation,
          },
          className
        )}
        {...domRest}
      >
        {children}
      </div>
    )
)
AnimatedView.displayName = "AnimatedView"
