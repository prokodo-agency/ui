import { create } from "@/helpers/bem"

import styles from "./Icon.module.scss"

import type { IconProps, IconSize } from "./Icon.model"
import type { IconName } from "./IconList"
import type { FC } from "react"

declare const __PACKAGE_VERSION__: string

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
  `https://cdn.jsdelivr.net/gh/prokodo-agency/ui@v${__PACKAGE_VERSION__}/assets/icons/${name
    .replace(/Icon$/, "")
    .replace(/([a-z])([A-Z0-9])/g, "$1_$2")
    .replace(/([0-9])([a-zA-Z])/g, "$1_$2")
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
      aria-hidden={typeof label === "string" ? undefined : "true"}
      className={bem(undefined, undefined, className)}
      height={sizePx}
      role={typeof label === "string" ? "img" : "presentation"}
      src={urlFromName(name)}
      width={sizePx}
      {...rest}
    />
  )
}
