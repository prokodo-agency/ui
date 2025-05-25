import {
  lazy,
  Suspense,
  useMemo,
  type FC,
} from "react"
import { create } from "@/helpers/bem"
import styles from "./Icon.module.scss"
import type { IconProps, IconSize } from "./Icon.model"
import { ICONS } from "./iconsMap"

const bem = create(styles, "Icon")

const FallbackIcon: FC = () => (
  <svg viewBox="0 0 24 24" height="24" width="24">
    <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="2" />
    <line stroke="black" strokeWidth="2" x1="6" y1="6" x2="18" y2="18" />
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
  return loader ? loader() : Promise.resolve({ default: FallbackIcon })
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
        return { default: module.default } // <-- wichtig
      }),
    [name]
  )

  return (
    <Suspense fallback={<FallbackIcon />}>
      <LazyIcon
        role={role}
        aria-hidden={ariaHidden}
        size={getIconSize(size)}
        color={color}
        name={name}
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
