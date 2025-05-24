import {
  lazy,
  Suspense,
  useMemo,
  type FC,
  type ComponentType,
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

// Converts PascalCase to snake_case used in filenames
const formatIconName = (name: string): string =>
  name
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/Icon$/, "")
    .toLowerCase()

const getIconLoader = (name: string) => {
  const snakeName = formatIconName(name)
  const loader = ICONS[`${snakeName}_icon`]
  return loader ? loader() : Promise.resolve({ default: FallbackIcon })
}

export const Icon: FC<IconProps> = ({
  name,
  size,
  color,
  className,
  ...props
}) => {
  const LazyIcon = useMemo(
    () =>
      lazy(async () => {
        const Component = await getIconLoader(name ?? "")
        return { default: Component as ComponentType<any> }
      }),
    [name]
  )

  return (
    <Suspense fallback={<FallbackIcon />}>
      <LazyIcon
        aria-hidden="true"
        role="presentation"
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
