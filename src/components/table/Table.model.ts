import type { HeadlineProps } from "../headline"
import type { IconProps } from "../icon"
import type { LinkProps } from "../link"
import type { TableHTMLAttributes, ReactNode } from "react"

export type TableType = "double" | "single"

// Define types for table header and body cells
export type TableHeaderCellProps = {
  label?: string
  colSpan?: number
  rowSpan?: number
  className?: string
}

export type TableBodyCellProps = {
  id?: string
  label?: string | ReactNode
  icon?: IconProps
  className?: string
  classNameInner?: string
}

export type TableRowProps = {
  cells: TableBodyCellProps[]
  redirect?: LinkProps
}

export type TableData = {
  header?: TableHeaderCellProps[]
  body?: TableRowProps[]
}

export type TableProps = TableHTMLAttributes<HTMLTableElement> & {
  containerClassName?: string
  content?: string | null
  type?: TableType
  caption: string
  ariaLabel: string
  title?: string | null
  titleProps?: HeadlineProps
  header: TableHeaderCellProps[]
  body: TableRowProps[]
}
