"use client"
import {
  type FC,
  type ReactNode,
  type HTMLAttributes,
  type KeyboardEvent,
  type RefAttributes,
  useCallback,
} from "react"

import BGprimary1 from "@/assets/images/card_background_primary_1.webp"
import BGprimary2 from "@/assets/images/card_background_primary_2.webp"
import BGprimary3 from "@/assets/images/card_background_primary_3.webp"
import BGprimary4 from "@/assets/images/card_background_primary_4.webp"
import BGsecondary1 from "@/assets/images/card_background_secondary_1.webp"
import BGsecondary2 from "@/assets/images/card_background_secondary_2.webp"
import BGsecondary3 from "@/assets/images/card_background_secondary_3.webp"
import BGsecondary4 from "@/assets/images/card_background_secondary_4.webp"
import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import { Animated } from "../animated"
import { Image } from "../image"
import { Link } from "../link"
import { Skeleton } from "../skeleton"

import styles from "./Card.module.scss"

import type { CardProps } from "./Card.model"
import type { WordSet } from "react-bem-helper"

const bem = create(styles, "Card")

export const Card: FC<CardProps> = ({
  ref,
  variant = "white",
  loading,
  skeletonProps = {},
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
  onClick,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  children,
}) => {
  const renderSkeleton = useCallback(
    (modifier?: WordSet) =>
      Boolean(loading) && (
        <Skeleton
          className={bem("skeleton", modifier)}
          variant="rectangular"
          {...skeletonProps}
        />
      ),
    [loading, skeletonProps],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Enter") {
        onClick?.()
      }
      onKeyDown?.(e)
    },
    [onClick, onKeyDown],
  )

  const renderContainer = useCallback(
    (card: ReactNode) => {
      const isDisabled = disabled === true
      const onClickIsFunction = typeof onClick === "function"
      const isClickable =
        (onClickIsFunction && !isDisabled) || isString(redirect?.href)
      const modifier = {
        [variant]: true,
        "has-highlight": Boolean(highlight),
        "has-gradiant": Boolean(gradiant),
        "has-background": Boolean(background),
        "has-shadow":
          (isClickable && enableShadow === undefined) || Boolean(enableShadow),
        "has-animation": animated,
        "is-clickable": isClickable,
      }
      const cardProps: HTMLAttributes<HTMLDivElement> &
        RefAttributes<HTMLDivElement> = {
        ref,
        className: bem(undefined, modifier, className),
        role: isClickable ? "button" : undefined,
        "aria-disabled": isDisabled ? true : undefined,
        tabIndex: isClickable && !isDisabled && !Boolean(redirect) ? 0 : -1,
        onMouseEnter,
        onMouseLeave,
        onKeyDown: isClickable ? handleKeyDown : undefined,
        onClick: onClickIsFunction && !isDisabled ? onClick : undefined,
      }
      if (customAnimation) {
        return (
          <Animated animation={customAnimation} {...cardProps}>
            {renderSkeleton(modifier)}
            {card}
          </Animated>
        )
      }
      return (
        <div {...cardProps}>
          {renderSkeleton(modifier)}
          {card}
        </div>
      )
    },
    [
      ref,
      redirect,
      variant,
      highlight,
      gradiant,
      background,
      animated,
      customAnimation,
      className,
      onClick,
      handleKeyDown,
      onMouseEnter,
      onMouseLeave,
      disabled,
      enableShadow,
      renderSkeleton,
    ],
  )

  const renderCard = useCallback(
    () =>
      redirect !== undefined ? (
        <Link
          disabled={disabled}
          className={bem(
            "content",
            {
              [variant]: true,
              "has-link": true,
            },
            contentClassName,
          )}
          {...redirect}
        >
          {children}
        </Link>
      ) : (
        <div className={bem("content", undefined, contentClassName)}>
          {children}
        </div>
      ),
    [contentClassName, variant, redirect, disabled, children],
  )

  const renderBackground = useCallback(() => {
    let backgroundSrc = BGprimary1
    if (variant === "secondary") {
      switch (background) {
        case 2:
          backgroundSrc = BGsecondary2
          break
        case 3:
          backgroundSrc = BGsecondary3
          break
        case 4:
          backgroundSrc = BGsecondary4
          break
        default:
          backgroundSrc = BGsecondary1
      }
    }
    switch (background) {
      case 2:
        backgroundSrc = BGprimary2
        break
      case 3:
        backgroundSrc = BGprimary3
        break
      case 4:
        backgroundSrc = BGprimary4
        break
    }
    return (
      <Image
        alt="prokodo - background image"
        src={typeof background === "string" ? background : backgroundSrc}
        {...backgroundProps}
        className={bem("background", undefined, backgroundProps?.className)}
        imageComponent={backgroundProps?.imageComponent ?? "img"}
      />
    )
  }, [variant, background, backgroundProps])

  if (Boolean(gradiant)) {
    return renderContainer(
      <div
        className={bem(
          "gradiant",
          {
            [variant]: variant !== "inherit" && variant !== "white",
          },
          gradiantClassName,
        )}
      >
        {renderCard()}
      </div>,
    )
  }
  if (background !== undefined) {
    return renderContainer(
      <>
        {renderCard()}
        {renderBackground()}
      </>,
    )
  }
  return renderContainer(renderCard())
}
