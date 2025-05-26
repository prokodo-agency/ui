"use client"
import {
  lazy,
  Suspense,
  useMemo,
  type FC,
  type ComponentType,
} from "react"

import { create } from "@/helpers/bem"

import { getIconLoader } from "./getIconLoader"
import styles from "./Icon.module.scss"

import type { IconProps, IconSize } from "./Icon.model"
import type { IconName } from "./icons"

const bem = create(styles, "Icon")

export const getIconSize = (size?: IconSize): number => {
  switch (size) {
    case "xs":
      return 15
    case "sm":
      return 20
    case "md":
      return 30
    case "lg":
      return 40
    case "xl":
      return 50
    default:
      return size ?? 16
  }
}

export const Icon: FC<IconProps> = ({
  name,
  size,
  color,
  className,
  role = "presentation",
  "aria-hidden": ariaHidden = role === "presentation" ? "true" : undefined,
  suspenseProps,
  ...props
}) => {
  const LazyIcon = useMemo<ComponentType<Partial<IconProps>> | null>(() => {
    const loader = getIconLoader(name as IconName)
    return loader ? lazy(loader) : null
  }, [name])

  const sizePx = getIconSize(size)

  return LazyIcon ? (
    <Suspense
      fallback={<span style={{ width: sizePx, height: sizePx, display: "inline-block" }} />}
      {...suspenseProps}
    >
      <LazyIcon
        aria-hidden={ariaHidden}
        color={color}
        name={name}
        role={role}
        size={sizePx}
        {...props}
        className={bem(undefined, typeof color === "string" ? { [color]: true } : undefined, className)}
      />
    </Suspense>
  ) : (
    <span style={{ width: sizePx, height: sizePx, display: "inline-block" }} />
  )
}
