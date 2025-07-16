import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import { Icon } from "../icon"
import { Link, type LinkProps } from "../link"

import styles from "./TableCell.module.scss"

import type { TableBodyCellProps, TableType } from "./Table.model"
import type { FC } from "react"

const bem = create(styles, "TableCell")

type TableCellProps = TableBodyCellProps & {
  type?: TableType
  className?: string
  redirect?: LinkProps
}

export const TableCell: FC<TableCellProps> = ({
  id,
  type,
  label,
  icon,
  className,
  classNameInner,
  redirect,
  ...props
}) => {
  const cellProps = type === "double" ? { ...props, scope: "row" } : props

  const renderCellContent = () => (
    <>
      {isString(icon?.name) && (
        <Icon
          className={bem("icon", undefined, icon?.className)}
          color={icon?.color}
          name={icon?.name}
          size={25}
        />
      )}
      {label}
    </>
  )

  return (
    <td
      {...cellProps}
      className={bem(undefined, { "has-icon": Boolean(icon) }, className)}
      id={id}
    >
      {redirect?.href !== undefined ?
        <Link priority {...redirect} className={bem("inner", {"has-link": true}, redirect?.className ?? classNameInner)}>
          {renderCellContent()}
        </Link>
      : (
        <span className={bem("inner", undefined, classNameInner)}>
          {renderCellContent()}
        </span>
      )}
    </td>
  )
}
