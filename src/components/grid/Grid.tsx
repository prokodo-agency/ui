import { type FC, memo } from "react"

import { create } from "@/helpers/bem"

import styles from "./Grid.module.scss"

import type { GridProps } from "./Grid.model"

const bem = create(styles, "Grid")

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
