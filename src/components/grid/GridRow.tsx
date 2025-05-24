import { type FC, type ReactNode, type HTMLAttributes, memo } from "react"

import { create } from "@/helpers/bem"

import styles from "./GridRow.module.scss"

const bem = create(styles, "GridRow")

export type GridRowProps = HTMLAttributes<HTMLDivElement> & {
  spacing?: number
  align?: "left" | "center" | "right"
  className?: string
  children?: ReactNode
  // Breakpoints
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
}

export const GridRow: FC<GridRowProps> = memo(
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
  ),
)

GridRow.displayName = "GridRow"
