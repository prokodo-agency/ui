/* components/icon/Icon.tsx
   ───────────────────────────────────────── */
import { PROKODO_UI_VERSION } from "@/constants/project"
import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import styles from "./Icon.module.scss"

import type { IconProps, IconSize } from "./Icon.model"
import type { IconName } from "./IconList"
import type { FC, CSSProperties } from "react"

const bem = create(styles, "Icon")

/* ---------- size helper --------------------------------- */
export const getIconSize = (s?: IconSize): number =>
  ({ xs: 15, sm: 20, md: 30, lg: 40, xl: 50 } as const)[
    s as keyof object
  ] ?? (s ?? 16)

/* ---------- icon URL (CDN) ------------------------------- */
const iconUrl = (n: IconName): string =>
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
  const isCustomColor = Boolean(color?.includes("#")) || Boolean(color?.includes("rgb")) || Boolean(color?.includes("rgba"))
  const sizePx = getIconSize(size)
  const url    = iconUrl(name)
  const mask: CSSProperties = {
    width:  sizePx,
    height: sizePx,
    backgroundColor: Boolean(isCustomColor) ? color : "currentColor",
    maskImage:       `url("${url}")`,
    WebkitMaskImage: `url("${url}")`,

  }

  return (
    <span
      {...rest}
      aria-hidden={isString(label) ? undefined : true}
      aria-label={label}
      role={isString(label) ? "img" : "presentation"}
      style={{ ...mask }}
      className={bem(undefined, {
        [`${color}`]: Boolean(color),
      }, className)}
    />
  )
}

Icon.displayName = "Icon"
