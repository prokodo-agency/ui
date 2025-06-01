import { AnimatedView } from "@/components/animated/Animated.view"
import { Image } from "@/components/image"
import { Skeleton } from "@/components/skeleton"
import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import styles from "./Card.module.scss"

import type { CardProps } from "./Card.model"
import type { AnimatedViewProps } from "@/components/animated/Animated.model"
import type { JSX } from "react"

const bem = create(styles, "Card")

export function CardView({
  isClickable,
  variant = "white",
  loading,
  skeletonProps,
  highlight,
  gradiant,
  gradiantClassName,
  enableShadow,
  animated = true,
  customAnimation,
  className,
  contentClassName,
  background,
  backgroundProps,
  children,
  animationProps,
  ...rest
}: CardProps & {
  animationProps?: AnimatedViewProps
  isClickable?: boolean
}): JSX.Element {
  const mod = {
    [variant]: true,
    "is-clickable": Boolean(isClickable),
    "has-highlight": Boolean(highlight),
    "has-gradiant": Boolean(gradiant),
    "has-background": Boolean(background),
    "has-shadow": Boolean(enableShadow) || Boolean(isClickable),
    "has-animation": Boolean(animated),
  }

  const container = (
    <div className={bem(undefined, mod, className)} {...rest}>
      {Boolean(loading) && (
        <Skeleton
          className={bem("skeleton", mod)}
          variant="rectangular"
          {...skeletonProps}
        />
      )}

      {/* content */}
      <div className={bem("content", undefined, contentClassName)}>
        {children}
      </div>

      {/* background/gradiant */}
      {Boolean(gradiant) && (
        <div
          className={bem(
            "gradiant",
            { [variant]: variant !== "inherit" && variant !== "white" },
            gradiantClassName,
          )}
        />
      )}
      {isString(background) && (
        <Image
          alt="card background"
          imageComponent={backgroundProps?.imageComponent ?? "img"}
          src={background}
          className={bem(
            "background",
            undefined,
            backgroundProps?.className,
          )}
          {...backgroundProps}
        />
      )}
    </div>
  )

  return animated ? (
    <AnimatedView
      {...animationProps}
      animation={customAnimation}
      isVisible={animated}
    >
      {container}
    </AnimatedView>
  ) : (
    container
  )
}
