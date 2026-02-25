import { Animated } from "@/components/animated/Animated"
import { Image } from "@/components/image"
import { Link, type LinkProps } from "@/components/link"
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
  const modifiers = {
    [variant]: true,
    "is-clickable": Boolean(isClickable),
    "has-highlight": Boolean(highlight),
    "has-gradiant": Boolean(gradiant),
    "has-background": Boolean(background),
    "has-shadow":
      enableShadow !== false && (Boolean(isClickable) || Boolean(enableShadow)),
    "has-animation": Boolean(animated), // hook only; actual animation rules live in effects sheet
  }

  const innerCard = (
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    <div
      className={bem(undefined, modifiers, className)}
      role={
        /* istanbul ignore next */ !redirect && Boolean(isClickable)
          ? "button"
          : undefined
      }
      tabIndex={
        /* istanbul ignore next */ !redirect && Boolean(isClickable)
          ? 0
          : undefined
      }
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={
        /* istanbul ignore next */ Boolean(isClickable) && !redirect
          ? onClick
          : undefined
      }
      onKeyDown={
        /* istanbul ignore next */ Boolean(isClickable) && !redirect
          ? onKeyDown
          : undefined
      }
    >
      {Boolean(loading) && (
        <Skeleton
          className={bem("skeleton", modifiers)}
          variant="rectangular"
          {...skeletonProps}
        />
      )}

      <div
        className={bem(
          "content",
          { "has-link": Boolean(redirect?.href) },
          contentClassName,
        )}
      >
        {children}
      </div>

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
          src={background as string}
          className={bem(
            "background",
            undefined,
            /* istanbul ignore next */ backgroundProps?.className,
          )}
          {...backgroundProps}
        />
      )}
    </div>
  )

  const content =
    redirect && redirect.href ? (
      <Link
        {...redirect}
        aria-disabled={redirect.disabled ?? false}
        className={bem("link", undefined, redirect?.className)}
        role={role}
        tabIndex={tabIndex}
      >
        {innerCard}
      </Link>
    ) : (
      innerCard
    )

  /* istanbul ignore else */
  if (animated) {
    /* istanbul ignore next */
    return (
      <Animated
        animation={customAnimation}
        {...(animatedProps as AnimatedViewProps | undefined)}
      >
        {content}
      </Animated>
    )
  }

  /* istanbul ignore next */
  return content
}
