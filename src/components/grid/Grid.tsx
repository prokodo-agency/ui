import { type FC, type HTMLAttributes, type ReactNode, memo } from "react"

import { create } from "@/helpers/bem"

import styles from "./Grid.module.scss"

const bem = create(styles, "Grid")

export type GridProps = HTMLAttributes<HTMLDivElement> & {
  spacing?: number // The spacing between child elements (applies to container)
  className?: string // Optional class names for custom styling
  children?: ReactNode // Child components or elements
}

export const Grid: FC<GridProps> = memo(
  ({ spacing = 2, className, children, ...props }) => (
    <div
      className={bem(undefined, undefined, className)}
      style={{
        gap: `${spacing * 8}px`,
      }}
      {...props}
    >
      {children}
    </div>
  ),
)

Grid.displayName = "Grid"
