import { Icon, getIconSize } from "@/components/icon"
import { Image } from "@/components/image"
import { Link } from "@/components/link"
import { create } from "@/helpers/bem"
import { isNumber } from "@/helpers/validations"

import styles from "./Avatar.module.scss"

import type { AvatarProps } from "./Avatar.model"
import type { JSX } from "react"

const bem = create(styles, "Avatar")

export function AvatarView({
  className,
  variant = "inherit",
  size = "sm",
  image,
  redirect,
  ...rest
}: AvatarProps): JSX.Element {
  const rootClass = bem(
    undefined,
    { [variant]: true, [`has-size-${size}`]: true },
    className,
  )
  const iconSize = getIconSize(size)
  const inner = (
    <div
      {...rest}
      className={rootClass}
      tabIndex={-1}
      style={
        isNumber(size as number)
          ? {
              width: size,
              height: size,
            }
          : undefined
      }
    >
      {image ? (
        <Image
          fill
          {...image}
          className={bem("image", undefined, image.className)}
          tabIndex={0}
        />
      ) : (
        <Icon
          className={bem("icon", { [variant]: true })}
          color={!["inherit", "white"].includes(variant) ? "white" : undefined}
          name="UserIcon"
          size={iconSize}
        />
      )}
    </div>
  )
  return redirect ? (
    <Link
      {...redirect}
      className={bem(
        "link",
        { [variant]: true, [`has-size-${size}`]: true },
        redirect.className,
      )}
    >
      {inner}
    </Link>
  ) : (
    inner
  )
}
