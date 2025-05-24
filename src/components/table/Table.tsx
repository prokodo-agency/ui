"use client"
import {
  type FC,
  type ReactNode,
  memo,
  useCallback,
  isValidElement,
} from "react"

import { create } from "@/helpers/bem"
import { isArray } from "@/helpers/validations"

import styles from "./Table.module.scss"

import type {
  TableProps,
  TableRowProps,
  TableHeaderCellProps,
  TableBodyCellProps,
} from "./Table.model"

const bem = create(styles, "Table")

export const Table: FC<TableProps> = memo(
  ({
    variant = "primary",
    className,
    ariaLabel,
    caption,
    headerType = "single",
    data,
    headerProps,
    bodyProps,
    ...props
  }) => {
    const renderTableBodyCell = useCallback(
      (props: TableBodyCellProps): ReactNode => {
        const cellProps =
          headerType === "double" ? { ...props, scope: "row" } : props
        const { label, icon, className, ...rest } = cellProps
        return (
          <td
            key={`table-body-cell-${label}`}
            className={bem("cell", { "with-icon": Boolean(icon) }, className)}
            {...rest}
          >
            {isValidElement(icon) ? (
              <span className={bem("cell__icon")}>{icon}</span>
            ) : null}
            {label}
          </td>
        )
      },
      [headerType],
    )

    if (!isArray(data?.header) || !isArray(data?.body)) return null

    return (
      <div className={bem("container", variant, className)}>
        <table
          aria-label={ariaLabel}
          className={bem(undefined, variant)}
          {...props}
        >
          <caption className={bem("caption")}>{caption}</caption>
          <thead className={bem("head", variant)} {...headerProps}>
            <tr className={bem("head__row")}>
              {data.header.map((cell: TableHeaderCellProps) => (
                <th
                  key={`table-header-cell-${cell.label}`}
                  className={bem("head__cell", cell.className)}
                  colSpan={cell.colSpan}
                  rowSpan={cell.rowSpan}
                >
                  {cell.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={bem("body", variant)} {...bodyProps}>
            {data.body.map(({ data, className }: TableRowProps) => (
              <tr
                key={`table-body-row-${data?.[0]?.label}`}
                className={bem("body__row", className)}
              >
                {data.map((cell: TableBodyCellProps) =>
                  renderTableBodyCell(cell),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  },
)

Table.displayName = "Table"
