import type { ButtonProps } from "@/components/button"
import type { HeadlineProps } from "@/components/headline"
import type { IconProps } from "@/components/icon"
import type { Schema } from "@/types/schema"
import type { Variants } from "@/types/variants"
import type { ReactNode, SyntheticEvent, HTMLAttributes } from "react"

/**
 * Action button configuration for accordion header.\
 * Inherits from Button component, but requires unique `id` for tracking and DOM manipulation.
 */
export type AccordionAction = Omit<ButtonProps, "id"> & {
  /** Unique ID for action button (required). Used for event tracking and element reference. */
  id: string
}

/**
 * Single accordion item (panel) content and header configuration.
 * Supports rich header customization via `renderHeader` or fallback to `title` + `titleOptions`.
 */
export type AccordionItem = {
  /** Panel title text. Ignored if `renderHeader` is provided. */
  title: string
  /** Headline component props for title styling (variant, size, weight). Only used when `renderHeader` is undefined. */
  titleOptions?: HeadlineProps
  /** Custom header content node. Takes precedence over `title` + `titleOptions`. Use for icons, badges, or complex layouts. */
  renderHeader?: ReactNode
  /** Optional header action buttons/controls (right-aligned). Renders alongside title. */
  renderHeaderActions?: ReactNode
  /** Expandable panel content. Rendered when panel is expanded (height animated). */
  renderContent: ReactNode
  /** Action buttons array (footer). Each button needs unique `id` for tracking. */
  actions?: AccordionAction[]
  /** Item wrapper class name for custom styling per panel. */
  className?: string
}

/**
 * Accordion component props.\
 * Manages expandable/collapsible panels with animated transitions.\
 * Supports single or multi-panel expansion via `expanded` prop (controlled) or internal state.
 *
 * @example
 * // Controlled expansion
 * <Accordion
 *   id="faq"
 *   expanded={0}
 *   items={[...]}
 *   onChange={(index) => setExpanded(index)}
 * />
 *
 * @example
 * // With custom actions and rich headers
 * <Accordion
 *   id="settings"
 *   items={[
 *     {
 *       title: "General",
 *       renderHeader: <span><GearIcon /> Settings</span>,
 *       renderContent: <SettingsPanel />,
 *       actions: [
 *         { id: "save", label: "Save" },
 *         { id: "reset", label: "Reset", variant: "outlined" }
 *       ]
 *     }
 *   ]}
 * />
 */
export type AccordionProps = {
  /** Unique accordion ID. Required for internal state management and DOM reference (aria-controls). */
  id: string
  /** Visual container style. `card` keeps elevated cards, `panel` renders flatter panel rows. */
  type?: "card" | "panel"
  /** Additional class name for every accordion header wrapper (`Accordion__header__wrapper`). */
  headerWrapperClassName?: string
  /** Additional class name for every accordion header toggle zone (`Accordion__header__toggle`). */
  headerToggleClassName?: string
  /** Initially expanded panel index (0-based). `null` = all collapsed. Controlled prop (overrides internal state). */
  expanded?: number | null
  /** Root element class name. */
  className?: string
  /** Visual variant (primary, secondary, neutral, etc.). Affects header/border colors. */
  variant?: Variants
  /** Default headline props for all item titles. Individual items can override via `titleOptions`. */
  titleOptions?: HeadlineProps
  /** Chevron/expand icon props (size, color, className). Rotates on expand/collapse. */
  iconProps?: IconProps
  /** Array of accordion items (panels). Each item requires `renderContent` (required). */
  items: AccordionItem[]
  /** JSON schema for dynamic form generation (if accordion wraps form fields). Optional. */
  schema?: Schema
  /**
   * Expansion state change callback.\
   * Fired when user clicks header or calls programmatic expand/collapse.\
   * @param index - Zero-based index of expanded item (undefined if all collapsed)
   * @param e - React synthetic event (click or keyboard)
   * @param expanded - True if panel was expanded; false if collapsed
   */
  onChange?: (index?: number, e?: SyntheticEvent, expanded?: boolean) => void
} & Omit<HTMLAttributes<HTMLDivElement>, "onChange">

/**
 * Internal type for Accordion view layer.\
 * Separates controlled `expanded` prop from internal `expandedIndex` state.\
 * Renames `onChange` to `onToggle` for view-layer clarity.
 */
export type AccordionViewProps = Omit<
  AccordionProps,
  "expanded" | "onChange" | "onToggle"
> & {
  /** Currently expanded panel index (0-based). `null` = all collapsed. Managed by view or parent state. */
  expandedIndex?: number | null
  /** Internal toggle handler. Called when header is clicked. View manages expansion animation and state. */
  onToggle?: (index: number, event: SyntheticEvent<HTMLDivElement>) => void
}
