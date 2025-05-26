"use client"
import { type FC, type SyntheticEvent, useCallback, useState } from "react"

import { Animated } from "@/components/animated"
import { Button, type ButtonProps } from "@/components/button"
import { Headline } from "@/components/headline"
import MinusSignIcon from "@/components/icon/loaders/MinusSignIcon"
import PlusSignIcon from "@/components/icon/loaders/PlusSignIcon"
import { create } from "@/helpers/bem"
import { isNull } from "@/helpers/validations"


import styles from "./Accordion.module.scss"

import type { AccordionProps } from "./Accordion.model"

const bem = create(styles, "Accordion")

export const Accordion: FC<AccordionProps> = ({
  id,
  expanded,
  className,
  variant = "primary",
  titleOptions,
  items,
  onChange,
  iconOverride,
  ...props
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(expanded)

  const handleChange = useCallback(
    (index: number, event?: SyntheticEvent) => {
      const newIndex = expandedIndex === index ? null : index
      setExpandedIndex(newIndex)
      onChange(index, event, newIndex !== null)
    },
    [expandedIndex, onChange],
  )

  const renderIcon = useCallback(
    (isExpanded?: boolean) => {
      const iconSize = 20
      if (Boolean(isExpanded)) {
        return iconOverride?.expanded ?? (
          <MinusSignIcon className={bem("icon")} size={iconSize} />
        )
      }
      return iconOverride?.collapsed ?? (
        <PlusSignIcon className={bem("icon")} size={iconSize} />
      )
    },
    [iconOverride],
  )

  return (
    <div className={bem(undefined, { [variant]: true }, className)} {...props}>
      {items.map((item, index) => {
        const {
          className: itemClassName,
          title,
          renderHeader,
          renderContent,
          actions,
        } = item
        const accId = `${id}-${item.title}`
        const isExpanded = expandedIndex === index

        return (
          <div
            key={accId}
            className={bem(
              "item",
              { "is-expanded": isExpanded },
              itemClassName,
            )}
          >
            <div
              aria-controls={`${accId}-content`}
              aria-expanded={isExpanded}
              className={bem("header", { "is-expanded": isExpanded })}
              id={`${accId}-header`}
              role="button"
              tabIndex={0}
              onClick={e => handleChange(index, e)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") handleChange(index, e)
              }}
            >
              {!isNull(renderHeader) ? (
                renderHeader
              ) : (
                <Headline
                  className={bem("title", { "is-expanded": isExpanded })}
                  size="sm"
                  type="h3"
                  {...(item?.titleOptions ?? titleOptions)}
                >
                  {title}
                </Headline>
              )}
              {renderIcon(isExpanded)}
            </div>
            <div
              aria-labelledby={`${accId}-header`}
              className={bem("content", { "is-expanded": isExpanded })}
              hidden={!isExpanded}
              id={`${accId}-content`}
              role="region"
            >
              {!isNull(renderContent) && <Animated>{renderContent}</Animated>}
              {actions && actions.length > 0 && (
                <div className={bem("actions")}>
                  {actions.map(action => (
                    <Button
                      key={`${accId}-action-${action.id}`}
                      {...(action as ButtonProps)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

Accordion.displayName = "Accordion"
