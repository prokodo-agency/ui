/* components/icon/Icon.tsx
   ───────────────────────────────────────── */
import { PROKODO_UI_VERSION } from "@/constants/project"
import { create } from "@/helpers/bem"
import styles from "./Icon.module.scss"

import type { FC, CSSProperties } from "react"
import type { IconProps, IconSize } from "./Icon.model"
import type { IconName } from "./IconList"

const bem = create(styles, "Icon")

/* ---------- size helper --------------------------------- */
export const getIconSize = (s?: IconSize) =>
  ({ xs: 15, sm: 20, md: 30, lg: 40, xl: 50 } as const)[
    s as keyof object
  ] ?? (s ?? 16)

/* ---------- icon URL (CDN) ------------------------------- */
const iconUrl = (n: IconName) =>
  `https://cdn.jsdelivr.net/gh/prokodo-agency/ui@v${PROKODO_UI_VERSION}/assets/icons/${n
    .replace(/Icon$/, "")
    .replace(/([a-z])([A-Z0-9])/g, "$1_$2")
    .replace(/([0-9])([a-zA-Z])/g, "$1_$2")
    .toLowerCase()}_icon.svg`

/* ---------- Component ----------------------------------- */
export const Icon: FC<IconProps> = ({
  name,
  size,
  label,
  color,
  className,
  ...rest
}) => {
  if (!name) return null
  const isCustomColor = color?.includes("#") || color?.includes("rgb") || color?.includes("rgba")
  const sizePx = getIconSize(size)
  const url    = iconUrl(name)
  const mask: CSSProperties = {
    width:  sizePx,
    height: sizePx,
    backgroundColor: isCustomColor ? color : "currentColor",
    maskImage:       `url("${url}")`,
    WebkitMaskImage: `url("${url}")`,
    
  }

  return (
    <span
      {...rest}
      style={{ ...mask }}
      className={bem(undefined, {
        [`${color}`]: Boolean(color),
      }, className)}
      role={label ? "img" : "presentation"}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  )
}

Icon.displayName = "Icon"
