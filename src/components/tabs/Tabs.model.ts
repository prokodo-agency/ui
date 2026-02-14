import type { ChipProps } from "../chip"
import type { KeyboardEvent, MouseEvent, ReactNode, RefObject } from "react"

export type TabsBadgeChipProps = Omit<ChipProps, "label">

/**
 * A single tab definition.
 *
 * Best practice:
 * - Use stable `value` keys (do not localize keys).
 * - Keep labels short for better keyboard and screen reader scanning.
 */
export type TabsItem<Value extends string = string> = {
  /** Stable value used as selected key. */
  value: Value
  /** Visible tab label (text or custom React node). */
  label: ReactNode
  /** Optional badge content displayed near the label. */
  badge?: ReactNode
  /** Optional Chip props overriding global badge chip props for this item. */
  badgeChipProps?: TabsBadgeChipProps
  /** Optional disabled state for this tab. */
  disabled?: boolean
  /** Optional panel class name for this tab's content container. */
  className?: string
  /** Content rendered inside the tab panel. */
  content: ReactNode
}

/**
 * Change event emitted when selected tab changes.
 */
export type TabsChangeEvent<Value extends string = string> = {
  /** Selected tab value. */
  value: Value
  /** Index of the selected tab in `items`. */
  index: number
}

/**
 * Public props for Tabs.
 *
 * Accessibility:
 * - Implements WAI-ARIA tablist/tabs/tabpanels pattern.
 * - Supports Home/End and Arrow navigation.
 * - Supports automatic or manual activation mode.
 */
export type TabsProps<Value extends string = string> = {
  /** Unique id base used for generated tab + panel ids. */
  id: string
  /** Accessible label for the tablist. */
  ariaLabel?: string
  /** Tab item definitions. */
  items: TabsItem<Value>[]
  /** Controlled selected value. */
  value?: Value
  /** Uncontrolled initial selected value. */
  defaultValue?: Value
  /** Whether arrow navigation auto-selects the focused tab. */
  activationMode?: "automatic" | "manual"
  /** Layout orientation. */
  orientation?: "horizontal" | "vertical"
  /** Disables entire tabs interaction. */
  disabled?: boolean
  /** Makes tab triggers stretch to available width. */
  fullWidth?: boolean
  /** Root class name. */
  className?: string
  /** Tablist class name. */
  listClassName?: string
  /** Trigger button class name. */
  tabClassName?: string
  /** Class name applied to every tab panel container. */
  panelsClassName?: string
  /** Global Chip props for all tab badges (item props can override). */
  badgeChipProps?: TabsBadgeChipProps
  /** Change callback (controlled + uncontrolled). */
  onChange?: (event: TabsChangeEvent<Value>) => void
}

/**
 * Internal client state for interactive behavior.
 *
 * @internal
 */
export type TabsClientState<Value extends string = string> = {
  activeValue: Value
  focusIndex: number
  tabsRef: RefObject<Array<HTMLButtonElement | null>>
  onTabClick: (index: number, event: MouseEvent<HTMLButtonElement>) => void
  onTabKeyDown: (index: number, event: KeyboardEvent<HTMLButtonElement>) => void
}

/**
 * Internal view props.
 *
 * @internal
 */
export type TabsViewProps<Value extends string = string> = TabsProps<Value> & {
  _clientState?: TabsClientState<Value>
}
