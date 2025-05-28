import { create } from "@/helpers/bem"
import { isNull } from "@/helpers/validations"

import styles from "./Accordion.module.scss"

import type { AccordionViewProps } from "./Accordion.model"
import type { ButtonProps } from "@/components/button"

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
  AnimatedComponent,
  ButtonComponent,
  HeadlineComponent,
  IconComponent,
  ...domRest
}: AccordionViewProps) {
  return (
    <div className={bem(undefined, { [variant]: true }, className)} {...domRest}>
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
                <HeadlineComponent
                  className={bem("title", { "is-expanded": isExpanded })}
                  size="sm"
                  type="h3"
                  {...(item.titleOptions ?? titleOptions)}
                >
                  {title}
                </HeadlineComponent>
              )}

              <IconComponent
                className={bem("icon", { "is-hidden": isExpanded })}
                color="primary"
                name="PlusSignIcon"
                size="sm"
                {...iconProps}
              />
              <IconComponent
                className={bem("icon", { "is-hidden": !isExpanded })}
                color="white"
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
              {!isNull(renderContent) && <AnimatedComponent>{renderContent}</AnimatedComponent>}

              {actions?.length ? (
                <div className={bem("actions")}>
                  {actions.map((action) => (
                    <ButtonComponent key={`${accId}-action-${action.id}`} {...(action as ButtonProps)} />
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
