import { AnimatedView } from "@/components/animated/Animated.view"
import { Skeleton } from "@/components/skeleton"
import { Image } from "@/components/image"
import bgP1 from "@/assets/images/card_background_primary_1.webp"
import bgP2 from "@/assets/images/card_background_primary_2.webp"
import bgP3 from "@/assets/images/card_background_primary_3.webp"
import bgP4 from "@/assets/images/card_background_primary_4.webp"
import bgS1 from "@/assets/images/card_background_secondary_1.webp"
import bgS2 from "@/assets/images/card_background_secondary_2.webp"
import bgS3 from "@/assets/images/card_background_secondary_3.webp"
import bgS4 from "@/assets/images/card_background_secondary_4.webp"

import { create } from "@/helpers/bem"

import styles from "./Card.module.scss"

import type { AnimatedViewProps } from "@/components/animated/Animated.model"
import type { CardProps } from "./Card.model"

const bem = create(styles, "Card")

/** Helper picks correct background */
function pickBg(variant: string, bg?: CardProps["background"]) {
  if (typeof bg === "string") return bg
  if (variant === "secondary")
    return [bgS1, bgS2, bgS3, bgS4][(bg ?? 1) - 1]
  return [bgP1, bgP2, bgP3, bgP4][(bg ?? 1) - 1]
}

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
  disabled,
  redirect,
  children,
  animationProps,
  ...rest
}: CardProps & {
  animationProps?: AnimatedViewProps
  isClickable?: boolean
}) {
  const mod = {
    [variant]: true,
    "is-clickable": Boolean(isClickable),
    "has-highlight": Boolean(highlight),
    "has-gradiant": Boolean(gradiant),
    "has-background": Boolean(background),
    "has-shadow": Boolean(enableShadow),
    "has-animation": Boolean(animated),
  }

  const container = (
    <div className={bem(undefined, mod, className)} {...rest}>
      {loading && (
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
      {gradiant && (
        <div
          className={bem(
            "gradiant",
            { [variant]: variant !== "inherit" && variant !== "white" },
            gradiantClassName,
          )}
        />
      )}
      {background && (
        <Image
          alt="card background"
          src={pickBg(variant, background)}
          className={bem(
            "background",
            undefined,
            backgroundProps?.className,
          )}
          imageComponent={backgroundProps?.imageComponent ?? "img"}
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
