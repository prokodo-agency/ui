import type { HeadlineProps } from "../headline"
import type { IconProps } from "../icon"
import type { TableHTMLAttributes } from "react"

export type TableType = "double" | "single"

// Define types for table header and body cells
export type TableHeaderCellProps = {
  label?: string
  colSpan?: number
  rowSpan?: number
  className?: string
}

export type TableBodyCellProps = {
  label?: string
  icon?: IconProps
}

export type TableRowProps = {
  cells: TableBodyCellProps[]
}

export type TableData = {
  header?: TableHeaderCellProps[]
  body?: TableRowProps[]
}

export type TableProps = TableHTMLAttributes<HTMLTableElement> & {
  content?: string | null
  type?: TableType
  caption: string
  ariaLabel: string
  title?: string | null
  titleProps?: HeadlineProps
  header: TableHeaderCellProps[]
  body: TableRowProps[]
}