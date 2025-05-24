"use client"

import {
  type FC,
  type ReactNode,
  Fragment,
  memo,
  useCallback,
  useMemo,
} from "react"

import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import { Card } from "../card"
import { Icon, type IconName } from "../icon"
import { Link, type LinkProps } from "../link"

import styles from "./List.module.scss"

import type {
  ListProps,
  ListItemProps,
  ListDefaultItemProps,
  ListCardItemProps,
} from "./List.model"
import type { Variants } from "@/types/variants"

const bem = create(styles, "List")

// Memoized List component to prevent unnecessary re-renders
export const List: FC<ListProps> = memo(
  ({
    type,
    variant = "inherit",
    className,
    options = {},
    items,
    classNameDesc,
    ...props
  }) => {
    const modifier = useMemo(
      () => ({
        [`${type}`]: !!type,
      }),
      [type],
    )

    const renderTitle = useCallback(
      (title: string, item?: ListDefaultItemProps) => (
        <span
          className={bem("item__title", {
            "is-clickable": !!item?.onClick,
            ...modifier,
          })}
        >
          {title}
        </span>
      ),
      [modifier],
    )

    const renderLink = useCallback(
      (props: LinkProps, children: ReactNode) => (
        <Link
          className={bem("item__link", undefined, props?.className)}
          variant={variant}
          {...props}
        >
          {children}
        </Link>
      ),
      [variant],
    )

    const renderIcon = useCallback(
      (name?: IconName) => {
        if (!name) return null
        return (
          <div className={bem("item__icon__wrapper")}>
            <Icon color={variant as Variants} name={name} {...options?.icon} />
          </div>
        )
      },
      [variant, options?.icon],
    )

    const renderDesc = useCallback(
      (desc?: string) =>
        isString(desc) && (
          <p className={bem("item__desc", undefined, classNameDesc)}>{desc}</p>
        ),
      [classNameDesc],
    )

    const renderCardItem = useCallback(
      (item: ListCardItemProps) => {
        const icon = item?.icon
        return (
          <Card
            variant="white"
            {...item}
            className={bem("item__card", undefined, item?.className)}
            contentClassName={bem(
              "item__card__content",
              undefined,
              item?.contentClassName,
            )}
          >
            <div
              className={bem("item__inner", undefined, item?.innerClassName)}
            >
              {icon && (
                <div
                  className={bem(
                    "item__icon",
                    undefined,
                    item?.iconProps?.className,
                  )}
                >
                  <Icon
                    {...item?.iconProps}
                    className={bem("item__icon__svg")}
                    name={icon}
                    size="sm"
                  />
                </div>
              )}
              <div className={bem("item__content")}>
                {renderTitle(item.title)}
                {renderDesc(item?.desc)}
              </div>
            </div>
          </Card>
        )
      },
      [renderTitle, renderDesc],
    )

    const renderItem = useCallback(
      (item: ListItemProps) => {
        switch (type) {
          case "card":
            return renderCardItem(item as ListCardItemProps)
          default:
            if (item?.redirect !== undefined) {
              return renderLink(
                item.redirect,
                <Fragment>
                  {renderIcon(item?.icon)}
                  {renderTitle(item.title, item)}
                  {renderDesc(item?.desc)}
                </Fragment>,
              )
            }
            return (
              <Fragment>
                {renderIcon(item?.icon)}
                {renderTitle(item.title, item)}
                {renderDesc(item?.desc)}
              </Fragment>
            )
        }
      },
      [type, renderCardItem, renderIcon, renderLink, renderTitle, renderDesc],
    )

    return (
      <ul
        aria-live="polite"
        aria-relevant="additions text"
        {...props}
        className={bem(undefined, undefined, className)}
      >
        {items.map((item: ListItemProps) => {
          const isClickable = !!item?.onClick || !!item?.redirect
          // TODO: Add an additional Button component in li to resolve lint error
          return (
            /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */
            <li
              key={`list-item-${item.title}`}
              aria-pressed={isClickable ? false : undefined}
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : -1}
              className={bem(
                "item",
                {
                  "is-clickable": isClickable,
                  [`is-clickable--${item?.variant ?? variant}`]: isClickable,
                  ...modifier,
                },
                item?.className,
              )}
              onClick={
                type === "default" && isClickable
                  ? () => item.onClick?.(item)
                  : undefined
              }
              onKeyDown={
                isClickable
                  ? e => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        item?.onClick?.(item)
                      }
                    }
                  : undefined
              }
            >
              {renderItem(item)}
            </li>
          )
        })}
      </ul>
    )
  },
)

List.displayName = "List"
