import { Animated } from "@/components/animated"
import { Button, type ButtonProps } from "@/components/button"
import { Headline } from "@/components/headline"
import { Icon } from "@/components/icon"
import { create } from "@/helpers/bem"
import { isNull } from "@/helpers/validations"

import styles from "./Accordion.module.scss"

import type { AccordionViewProps } from "./Accordion.model"
import type { JSX } from "react"

const bem = create(styles, "Accordion")

export function AccordionView({
  id,
  variant = "primary",
  className,
  items,
  expandedIndex,
  onToggle,
  titleOptions,
  iconProps,
  ...domRest
}: AccordionViewProps): JSX.Element {
  return (
    <div {...domRest} className={bem(undefined, { [variant]: true }, className)}>
      {items.map((item, index) => {
        const { title, renderHeader, renderContent, actions, className: itemCls } = item
        const accId = `${id}-${title}`
        const isExpanded = expandedIndex === index

        return (
          <div
            key={accId}
            className={bem("item", { "is-expanded": isExpanded }, itemCls)}
          >
            <div
              aria-controls={`${accId}-content`}
              aria-expanded={isExpanded}
              className={bem("header", { "is-expanded": isExpanded })}
              id={`${accId}-header`}
              role="button"
              tabIndex={0}
              onClick={onToggle ? (e) => onToggle(index, e) : undefined}
              onKeyDown={
                onToggle
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") onToggle(index, e)
                    }
                  : undefined
              }
            >
              {!isNull(renderHeader) ? (
                renderHeader
              ) : (
                <Headline
                  animated
                  className={bem("title")}
                  highlight={isExpanded}
                  size="xs"
                  type="h3"
                  variant={isExpanded ? "primary" : "inherit"}
                  {...(item.titleOptions ?? titleOptions)}
                >
                  {title}
                </Headline>
              )}

              <Icon
                className={bem("icon", { "is-hidden": isExpanded })}
                color="inherit"
                name="PlusSignIcon"
                size="sm"
                {...iconProps}
              />
              <Icon
                className={bem("icon", { "is-hidden": !isExpanded })}
                color="inherit"
                name="MinusSignIcon"
                size="sm"
                {...iconProps}
              />
            </div>

            <div
              aria-labelledby={`${accId}-header`}
              className={bem("content", { "is-expanded": isExpanded })}
              hidden={!isExpanded}
              id={`${accId}-content`}
              role="region"
            >
              {!isNull(renderContent) && <Animated>{renderContent}</Animated>}

              {actions !== undefined && actions?.length ? (
                <div className={bem("actions")}>
                  {actions.map((action) => (
                    <Button key={`${accId}-action-${action.id}`} {...(action as ButtonProps)} />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
