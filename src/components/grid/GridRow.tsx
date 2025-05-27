import { create } from "@/helpers/bem"

import styles from "./GridRow.module.scss"

import type { GridRowProps } from "./Grid.model"
import type { FC } from "react"

const bem = create(styles, "GridRow")

export const GridRow: FC<GridRowProps> = (
  ({ align, className, children, xs, sm, md, lg, xl, ...props }) => (
    <div
      className={bem(
        undefined,
        {
          [`align-${align}`]: Boolean(align),
          [`xs-${xs}`]: Boolean(xs),
          [`sm-${sm}`]: Boolean(sm),
          [`md-${md}`]: Boolean(md),
          [`lg-${lg}`]: Boolean(lg),
          [`xl-${xl}`]: Boolean(xl),
        },
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
)

GridRow.displayName = "GridRow"
