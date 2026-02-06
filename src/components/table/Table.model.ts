import type { HeadlineProps } from "../headline"
import type { IconProps } from "../icon"
import type { LinkProps } from "../link"
import type { TableHTMLAttributes, ReactNode } from "react"

/**
 * Table border style.
 */
export type TableType = "double" | "single"

/**
 * Table header cell configuration.
 */
export type TableHeaderCellProps = {
  /** Header cell label text. */
  label?: string
  /** Column span (default: 1). */
  colSpan?: number
  /** Row span (default: 1). */
  rowSpan?: number
  /** Optional class name for the cell. */
  className?: string
}

/**
 * Table body cell configuration.
 */
export type TableBodyCellProps = {
  /** Optional cell id. */
  id?: string
  /** Cell content (text or node). */
  label?: string | ReactNode
  /** Optional icon with props. */
  icon?: IconProps
  /** Cell class name. */
  className?: string
  /** Inner wrapper class name. */
  classNameInner?: string
}

/**
 * Table row definition.
 */
export type TableRowProps = {
  /** Array of cells. */
  cells: TableBodyCellProps[]
  /** Optional redirect link for the row. */
  redirect?: LinkProps
}

/**
 * Reusable table data structure.
 */
export type TableData = {
  /** Optional header cells. */
  header?: TableHeaderCellProps[]
  /** Optional body rows. */
  body?: TableRowProps[]
}

/**
 * Table component props.
 * Renders a semantic HTML table with header, body, and optional redirect links.
 *
 * @example
 * <Table
 *   caption="Users"
 *   ariaLabel="User list"
 *   header={[{ label: "Name" }, { label: "Email" }]}
 *   body={[{ cells: [{ label: "John" }, { label: "john@example.com" }] }]}
 * />
 */
export type TableProps = TableHTMLAttributes<HTMLTableElement> & {
  /** Container wrapper class name. */
  containerClassName?: string
  /** Optional descriptive content. */
  content?: string | null
  /** Table border style. */
  type?: TableType
  /** Table caption (required for a11y). */
  caption: string
  /** ARIA label for the table. */
  ariaLabel: string
  /** Optional title headline. */
  title?: string | null
  /** Title headline props. */
  titleProps?: HeadlineProps
  /** Header cells array. */
  header: TableHeaderCellProps[]
  /** Body rows array. */
  body: TableRowProps[]
}
