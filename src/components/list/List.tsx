import { isValidElement, type JSX, type KeyboardEvent } from "react"

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

/**
 * A fully server‐rendered List component.
 * Any interactive fragments (e.g. <Link> or clickable <li>) will hydrate on the client.
 */
export function List({
  type,
  variant = "inherit",
  className,
  options = {},
  items = [],
  classNameDesc,
  ...props
}: ListProps): JSX.Element {
  // Build a modifier object for BEM classes if `type` is truthy.
  const modifier: Record<string, boolean> = {}
  if (type) {
    modifier[type] = true
  }

  return (
    <ul
      // If your list is never updated dynamically, you can safely remove aria-live.
      aria-live="polite"
      aria-relevant="additions text"
      {...props}
      className={bem(undefined, undefined, className)}
    >
      {items.map((item: ListItemProps, i: number) => {
        const {
          id,
          title,
          desc,
          icon,
          redirect,
          onClick,
          variant: itemVariant,
          className: itemClassName,
        } = item
        const isClickable = Boolean(onClick || redirect)

        // 1) Prepare <li> props for keyboard accessibility if clickable:
        const liHandlers: {
          role?: string
          tabIndex?: number
          onClick?: () => void
          onKeyDown?: (e: KeyboardEvent) => void
        } = {}

        if (isClickable) {
          liHandlers.role = "button"
          liHandlers.tabIndex = 0

          // Only call onClick if this is a “default”‐typed list (not a card).
          if (type === "default" && onClick) {
            liHandlers.onClick = () =>
              void onClick(item as ListDefaultItemProps)
            liHandlers.onKeyDown = e => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onClick(item as ListDefaultItemProps)
              }
            }
          }
        }

        // 2) Compute the className for <li>:
        const liClass = bem(
          "item",
          {
            "is-clickable": isClickable,
            [`is-clickable--${itemVariant ?? variant}`]: isClickable,
            "has-icon": Boolean(item?.icon),
            ...modifier,
          },
          itemClassName,
        )

        // 3) Helper to render the title <span>:
        const TitleSpan = () => {
          const titleClass = bem(
            "item__title",
            {
              "is-clickable": isClickable,
              ...modifier,
            },
            "list-title",
          )
          return <span className={titleClass}>{title}</span>
        }

        // 4) Helper to render an optional description <p>:
        const DescParagraph = () => {
          if (!isString(desc as string) && !isValidElement(desc)) return null
          return (
            <div
              className={bem(
                "item__desc",
                { card: type === "card" },
                classNameDesc,
              )}
            >
              {desc as string}
            </div>
          )
        }

        // 5) Helper to render an icon (purely decorative):
        const IconWrapper = () => {
          if (icon === undefined || icon === null) return null
          // aria-hidden for decorative icons
          return (
            <div aria-hidden="true" className={bem("item__icon__wrapper")}>
              {isValidElement(icon) ? (
                icon
              ) : (
                <Icon
                  color={variant as Variants}
                  name={icon as IconName}
                  {...options.icon}
                />
              )}
            </div>
          )
        }

        // 6) If `type === "card"`, render a <Card> wrapper:
        if (type === "card") {
          const cardItem = item as ListCardItemProps
          return (
            <li
              key={`list-item-${id ?? i}`}
              className={liClass}
              {...liHandlers}
            >
              <Card
                priority
                variant="white"
                {...cardItem}
                className={bem("item__card", undefined, cardItem.className)}
                contentClassName={bem(
                  "item__card__content",
                  undefined,
                  cardItem.contentClassName,
                )}
              >
                <div
                  className={bem(
                    "item__inner",
                    undefined,
                    cardItem.innerClassName,
                  )}
                >
                  {/* Decorative Icon */}
                  {icon !== undefined && icon !== null && (
                    <div
                      aria-hidden="true"
                      className={bem(
                        "item__icon",
                        undefined,
                        cardItem.iconProps?.className,
                      )}
                    >
                      {isValidElement(icon) ? (
                        icon
                      ) : (
                        <Icon
                          {...cardItem.iconProps}
                          className={bem("item__icon__svg")}
                          name={icon as IconName}
                          size="sm"
                        />
                      )}
                    </div>
                  )}
                  <div className={bem("item__content")}>
                    <TitleSpan />
                    <DescParagraph />
                  </div>
                </div>
              </Card>
            </li>
          )
        }

        // 7) Otherwise, “default”‐type list or free‐form link item:
        if (redirect) {
          // If redirect is present, render a proper <Link> (anchor) inside <li>.
          const linkProps = redirect as LinkProps
          return (
            <li key={`list-item-${id ?? i}`} className={liClass}>
              <Link
                className={bem("item__link", undefined, linkProps.className)}
                variant={variant}
                {...linkProps}
              >
                <div className={bem("item__link__header")}>
                  <IconWrapper />
                  <TitleSpan />
                </div>
                <DescParagraph />
              </Link>
            </li>
          )
        }

        // 8) Finally: a non‐link, potentially clickable <li> that is NOT a card:
        return (
          <li key={`list-item-${id ?? i}`} className={liClass} {...liHandlers}>
            <IconWrapper />
            <TitleSpan />
            <DescParagraph />
          </li>
        )
      })}
    </ul>
  )
}

List.displayName = "List"
