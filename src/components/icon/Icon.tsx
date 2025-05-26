import { create } from "@/helpers/bem"

import styles from "./Icon.module.scss"

import type { IconName } from "./Icon-list"
import type { IconProps, IconSize } from "./Icon.model"
import type { FC } from "react"

const bem = create(styles, "Icon")

// ──────────────────────────────────────────────────────────
//  Size helper
// ──────────────────────────────────────────────────────────
export const getIconSize = (s?: IconSize): number => {
  switch (s) {
    case "xs": return 15
    case "sm": return 20
    case "md": return 30
    case "lg": return 40
    case "xl": return 50
    default:   return s ?? 16
  }
}

// ──────────────────────────────────────────────────────────
//  CDN helper
// ──────────────────────────────────────────────────────────
const urlFromName = (name: IconName) =>
  // TODO: Make version dynamic
  `https://cdn.jsdelivr.net/gh/prokodo/ui@v0.0.16/assets/icons/${name
    .replace(/Icon$/, "")
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase()}_icon.svg`

// ──────────────────────────────────────────────────────────
//  Component
// ──────────────────────────────────────────────────────────
export const Icon: FC<IconProps> = ({ name, size, label, className = "", ...rest }) => {
  if (!name) return null

  const sizePx = getIconSize(size)

  return (
    <img
      alt={label ?? ""}
      aria-hidden={label ? undefined : "true"}
      className={bem(undefined, undefined, className)}
      height={sizePx}
      role={label ? "img" : "presentation"}
      src={urlFromName(name)}
      width={sizePx}
      {...rest}
    />
  )
}
