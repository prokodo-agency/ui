import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import { Icon } from "../icon"

import styles from "./TableCell.module.scss"

import type { TableBodyCellProps, TableType } from "./Table.model"
import type { FC } from "react"

const bem = create(styles, "TableCell")

type TableCellProps = TableBodyCellProps & {
  type?: TableType
  className?: string
}

export const TableCell: FC<TableCellProps> = ({
  type,
  label,
  icon,
  className,
  ...props
}) => {
  const cellProps = type === "double" ? { ...props, scope: "row" } : props
  return (
    <td
      key={`table-body-cell-${label}`}
      {...cellProps}
      className={bem(undefined, { "has-icon": Boolean(icon) }, className)}
    >
      <span className={bem("inner")}>
        {isString(icon?.name) && (
          <Icon
            className={bem("icon", undefined, icon?.className)}
            color={icon?.color}
            name={icon?.name}
            size={25}
          />
        )}
        {label}
      </span>
    </td>
  )
}
