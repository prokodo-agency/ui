import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import { Animated } from "../animated"
import { Headline } from "../headline"
import { RichText } from "../rich-text"

import styles from "./Table.module.scss"
import { TableCell } from "./TableCell"

import type { TableProps } from "./Table.model"
import type { FC } from "react"

const bem = create(styles, "Table")

export const Table: FC<TableProps> = ({
  id,
  title,
  titleProps,
  content,
  ariaLabel,
  caption,
  type = "single",
  header,
  body,
  ...props
}) => {
  const ariaLabelId = `Table-${id}`
  return (
    <div className={bem()}>
      {isString(title) && (
        <Animated animation="left-right" className={bem("header")}>
          <Headline
            className={bem("headline", undefined)}
            id={ariaLabelId}
            size="xl"
            type="h2"
            {...titleProps}
          >
            {title}
          </Headline>
        </Animated>
      )}
      {isString(content) && (
        <Animated className={bem("content")} delay={500}>
          <RichText>{content}</RichText>
        </Animated>
      )}
      <div className={bem("table__wrapper")}>
        <table aria-label={ariaLabel} className={bem("table")} {...props}>
          <thead className={bem("head")}>
            <tr className={bem("head__row")}>
              {header.map(cell => (
                <th
                  key={`table-header-cell-${cell?.label}`}
                  className={bem("head__cell", undefined, cell?.className)}
                >
                  {cell?.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={bem("body")}>
            {body.map(row => (
              <tr
                key={`table-body-row-${row?.cells?.[0]?.label}`}
                className={bem("body__row", {"has-link": isString(row?.redirect?.href)})}
              >
                {row?.cells
                  .filter(el => el !== null)
                  .map(cell => (
                    <TableCell
                      key={`table-body-cell-${cell.label}`}
                      {...cell}
                      redirect={row?.redirect}
                      type={type}
                    />
                  ))}
              </tr>
            ))}
          </tbody>
          <caption className={bem("caption")}>{caption}</caption>
        </table>
      </div>
    </div>
  )
}
