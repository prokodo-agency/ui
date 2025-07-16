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
              {header.map((cell, i) => (
                <th
                  // eslint-disable-next-line react/no-array-index-key
                  key={`table-header-cell-${i}`}
                  className={bem("head__cell", undefined, cell?.className)}
                >
                  {cell?.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={bem("body")}>
            {body.map((row, a) => (
              <tr
                // eslint-disable-next-line react/no-array-index-key
                key={`table-body-row-${a}`}
                className={bem("body__row", {"has-link": isString(row?.redirect?.href)})}
              >
                {row?.cells
                  .filter(el => el !== null)
                  .map((cell, b) => (
                    <TableCell
                      {...cell}
                      // eslint-disable-next-line react/no-array-index-key
                      key={`table-body-cell-${a}-${b}`}
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
