"use client"
import { type FC, useMemo, useCallback } from "react"

import UserIcon from "@/components/icon/loaders/UserIcon"
import { create } from "@/helpers/bem"

import { getIconSize } from "../icon"
import { Image } from "../image"
import { Link } from "../link"


import styles from "./Avatar.module.scss"

import type { AvatarProps } from "./Avatar.model"

const bem = create(styles, "Avatar")

export const Avatar: FC<AvatarProps> = ({
  className,
  variant = "primary",
  size = "sm",
  image,
  redirect,
  iconOverride,
  ...props
}) => {
  const variantModifier = useMemo(
    () => ({
      [variant]: !!variant,
    }),
    [variant],
  )
  const sizeModifier = useMemo(
    () => ({
      [`has-size-${size}`]: !!size,
    }),
    [size],
  )
  const renderAvatar = useCallback(
    () => (
      <div
        {...props}
        tabIndex={-1}
        className={bem(
          undefined,
          {
            ...variantModifier,
            ...sizeModifier,
          },
          className,
        )}
      >
        {image ? (
          <Image
            {...image}
            className={bem("image", undefined, image.className)}
            tabIndex={0}
          />
        ) : iconOverride ?? (
          <UserIcon
            className={bem("icon", variantModifier)}
            name="UserIcon"
            size={getIconSize(size) * 2}
            color={
              !["inherit", "white"].includes(variant) ? "white" : undefined
            }
          />
        )}
      </div>
    ),
    [sizeModifier, variantModifier, className, image, variant, size, iconOverride, props],
  )

  if (redirect) {
    return (
      <Link
        {...redirect}
        className={bem(
          "link",
          {
            ...variantModifier,
            ...sizeModifier,
          },
          redirect.className,
        )}
      >
        {renderAvatar()}
      </Link>
    )
  }
  return renderAvatar()
}
