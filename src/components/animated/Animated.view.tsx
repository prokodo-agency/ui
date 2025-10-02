import { create } from "@/helpers/bem"

import styles from "./Animated.module.scss"

import type { AnimatedViewProps } from "./Animated.model"
import type { FC } from "react"

const bem = create(styles, "Animated")

export const AnimatedView: FC<AnimatedViewProps> = ({
  className,
  disabled = false,
  speed = "normal",
  animation = "fade-in",
  isVisible,
  children,
  ...domRest
}) => (
  <div
    className={bem(
      undefined,
      {
        "is-visible": isVisible,
        "is-disabled": disabled,
        [`has-${speed}-speed`]: !!speed,
        [`animate-${animation}`]: !!animation,
      },
      className,
    )}
    {...domRest}
  >
    {children}
  </div>
)
AnimatedView.displayName = "AnimatedView"
