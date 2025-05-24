import type { Variants } from "@/types/variants"
import type { ReactNode, TableHTMLAttributes, HTMLAttributes } from "react"

// Define types for table header and body cells
export type TableHeaderCellProps = {
  label?: string
  colSpan?: number
  rowSpan?: number
  className?: string
}

export type TableBodyCellProps = {
  label?: string
  icon?: ReactNode
  colSpan?: number
  rowSpan?: number
  className?: string
}

export type TableRowProps = {
  data: TableBodyCellProps[]
  className?: string
}

export type TableData = {
  header?: TableHeaderCellProps[]
  body?: TableRowProps[]
}

// Define the table props interface
export type TableProps = TableHTMLAttributes<HTMLTableElement> & {
  ariaLabel: string
  caption: string
  variant?: Variants
  headerType?: "single" | "double"
  data?: TableData
  headerProps?: HTMLAttributes<HTMLTableSectionElement>
  bodyProps?: HTMLAttributes<HTMLTableSectionElement>
}
