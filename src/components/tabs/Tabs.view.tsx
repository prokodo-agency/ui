import { Chip } from "@/components/chip"
import { create } from "@/helpers/bem"

import styles from "./Tabs.module.scss"

import type { TabsItem, TabsViewProps } from "./Tabs.model"
import type { JSX } from "react"

const bem = create(styles, "Tabs")

function getFirstEnabledValue<Value extends string>(
  items: TabsItem<Value>[],
): Value | null {
  const firstEnabled = items.find(item => item.disabled !== true)
  return firstEnabled?.value ?? null
}

function resolveSelectedValue<Value extends string>(
  items: TabsItem<Value>[],
  value?: Value,
  defaultValue?: Value,
): Value | null {
  const activeCandidate = value ?? defaultValue

  if (activeCandidate !== undefined) {
    const isValid = items.some(
      item => item.value === activeCandidate && item.disabled !== true,
    )
    /* istanbul ignore else */
    if (isValid) return activeCandidate
  }

  return getFirstEnabledValue(items)
}

export function TabsView<Value extends string = string>({
  id,
  ariaLabel,
  items,
  value,
  defaultValue,
  orientation = "horizontal",
  disabled,
  fullWidth,
  className,
  listClassName,
  tabClassName,
  panelsClassName,
  badgeChipProps,
  _clientState,
}: TabsViewProps<Value>): JSX.Element | null {
  /* istanbul ignore next */
  if (!items?.length) return null

  const selectedValue =
    _clientState?.activeValue ??
    resolveSelectedValue(items, value, defaultValue) ??
    items[0]?.value

  return (
    <div
      className={bem(
        undefined,
        {
          vertical: orientation === "vertical",
        },
        className,
      )}
    >
      <div
        aria-label={ariaLabel}
        aria-orientation={orientation}
        role="tablist"
        className={bem(
          "list",
          {
            disabled: disabled === true,
            fullWidth: fullWidth === true,
            vertical: orientation === "vertical",
          },
          listClassName,
        )}
      >
        {items.map((item, index) => {
          const isDisabled = disabled === true || item.disabled === true
          const isSelected = item.value === selectedValue
          const tabId = `${id}-tab-${index}`
          const panelId = `${id}-panel-${index}`
          const mergedBadgeChipProps = {
            variant: "outlined" as const,
            color: "primary" as const,
            ...badgeChipProps,
            ...item.badgeChipProps,
          }
          const { className: badgeChipClassName, ...restBadgeChipProps } =
            mergedBadgeChipProps

          return (
            <button
              key={item.value}
              ref={node => {
                /* istanbul ignore next */
                if (_clientState?.tabsRef.current) {
                  _clientState.tabsRef.current[index] = node
                }
              }}
              aria-controls={panelId}
              aria-selected={isSelected}
              disabled={isDisabled}
              id={tabId}
              role="tab"
              tabIndex={isSelected ? 0 : -1}
              type="button"
              className={bem(
                "tab",
                {
                  disabled: isDisabled,
                  fullWidth: fullWidth === true,
                  selected: isSelected,
                  vertical: orientation === "vertical",
                },
                tabClassName,
              )}
              onClick={
                /* istanbul ignore next */ event =>
                  _clientState?.onTabClick(index, event)
              }
              onKeyDown={
                /* istanbul ignore next */ event =>
                  _clientState?.onTabKeyDown(index, event)
              }
            >
              <span className={bem("tabLabel")}>{item.label}</span>
              {item.badge ? (
                <Chip
                  {...restBadgeChipProps}
                  className={bem("badgeChip", undefined, badgeChipClassName)}
                  label={item.badge}
                />
              ) : null}
            </button>
          )
        })}
      </div>

      {items.map((item, index) => {
        const isSelected = item.value === selectedValue
        const tabId = `${id}-tab-${index}`
        const panelId = `${id}-panel-${index}`
        const mergedPanelClassName = [item.className, panelsClassName]
          .filter(Boolean)
          .join(" ")

        return (
          <div
            key={`${item.value}-panel`}
            aria-labelledby={tabId}
            hidden={!isSelected}
            id={panelId}
            role="tabpanel"
            tabIndex={0}
            className={bem(
              "panel",
              {
                selected: isSelected,
              },
              mergedPanelClassName,
            )}
          >
            {item.content}
          </div>
        )
      })}
    </div>
  )
}
