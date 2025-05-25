import {
  lazy,
  Suspense,
  useMemo,
  type FC,
} from "react"

import { create } from "@/helpers/bem"

import styles from "./Icon.module.scss"
import { ICONS } from "./iconsMap"

import type { IconProps, IconSize } from "./Icon.model"

const bem = create(styles, "Icon")

const FallbackIcon: FC = () => (
  <svg height="24" viewBox="0 0 24 24" width="24">
    <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="2" />
    <line stroke="black" strokeWidth="2" x1="6" x2="18" y1="6" y2="18" />
  </svg>
)

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

const getIconLoader = (name: string) => {
  const loader = ICONS[name]
  return typeof loader === "function" ? loader() : Promise.resolve({ default: FallbackIcon })
}

export const Icon: FC<IconProps> = ({
  name,
  size,
  color,
  className,
  role = "presentation",
  "aria-hidden": ariaHidden = role === "presentation" ? "true" : undefined,
  ...props
}) => {
  const LazyIcon = useMemo(
    () =>
      lazy(async () => {
        const module = await getIconLoader(name as string)
        return { default: module.default }
      }),
    [name]
  )

  return (
    <Suspense fallback={<FallbackIcon />}>
      <LazyIcon
        aria-hidden={ariaHidden}
        color={color}
        name={name}
        role={role}
        size={getIconSize(size)}
        {...props}
        className={bem(
          undefined,
          typeof color === "string" ? { [color]: true } : undefined,
          className
        )}
      />
    </Suspense>
  )
}
