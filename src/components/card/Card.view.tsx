import { Animated } from "@/components/animated/Animated"
import { Image }        from "@/components/image"
import { Link, type LinkProps }         from "@/components/link"
import { Skeleton }     from "@/components/skeleton"
import { create }       from "@/helpers/bem"
import { isString }     from "@/helpers/validations"

import styles           from "./Card.module.scss"

import type { CardProps } from "./Card.model"
import type { AnimatedViewProps } from "@/components/animated/Animated.model"
import type { JSX }     from "react"

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
  redirect,
  role,
  tabIndex,
  animatedProps,
  onClick,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
}: CardProps & {
  role?: string
  tabIndex?: number
  animationProps?: AnimatedViewProps
  isClickable?: boolean
  redirect?: LinkProps
}): JSX.Element {
  const mod = {
    [variant]: true,
    "is-clickable": Boolean(isClickable),
    "has-highlight": Boolean(highlight),
    "has-gradiant": Boolean(gradiant),
    "has-background": Boolean(background),
    "has-shadow":
      enableShadow !== false && (Boolean(isClickable) || Boolean(enableShadow)),
    "has-animation": Boolean(animated),
  }

  // 1. Build the “inner card” once:
  const innerCard = (
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    <div
      className={bem(undefined, mod, className)}
      role={!redirect && Boolean(isClickable) ? "button" : undefined}
      tabIndex={!redirect && Boolean(isClickable) ? 0 : -1}
      onClick={Boolean(isClickable) && !redirect ? onClick : undefined}
      onKeyDown={Boolean(isClickable) && !redirect ? onKeyDown : undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Skeleton if loading */}
      {Boolean(loading) && (
        <Skeleton
          className={bem("skeleton", mod)}
          variant="rectangular"
          {...skeletonProps}
        />
      )}

      {/* Content area, mark “has-link” if redirect exists */}
      <div className={bem("content", { "has-link": Boolean(redirect?.href) }, contentClassName)}>
        {children}
      </div>

      {/* Gradient bar */}
      {Boolean(gradiant) && (
        <div
          className={bem(
            "gradiant",
            { [variant]: variant !== "inherit" && variant !== "white" },
            gradiantClassName
          )}
        />
      )}

      {/* Background image */}
      {isString(background) && (
        <Image
          alt="card background"
          className={bem("background", undefined, backgroundProps?.className)}
          imageComponent={backgroundProps?.imageComponent ?? "img"}
          src={background as string}
          {...backgroundProps}
        />
      )}
    </div>
  )

  // 2. Wrap innerCard in <Link> if redirect exists; otherwise, just use innerCard
  const content = redirect && redirect.href
    ? (
      <Link
        {...redirect}
        aria-disabled={redirect.disabled ?? false}
        className={bem("link")}
        role={role}
        tabIndex={tabIndex}
      >
        {innerCard}
      </Link>
    )
    : innerCard

  // 3. If animated, wrap that content in a single <AnimatedView>; otherwise return content directly
  if (animated) {
    return (
      <Animated animation={customAnimation} {...animatedProps}>
        {content}
      </Animated>
    )
  }

  return content
}
