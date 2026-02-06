import type { Variants } from "@/types/variants"
import type {
  MouseEvent,
  KeyboardEvent,
  ReactNode,
  KeyboardEventHandler,
} from "react"

/** Visual appearance: filled (solid background) or outlined (border only). */
export type ChipVariant = "filled" | "outlined"

/** Color/semantic variant: primary, success, warning, error, info, etc. */
export type ChipColor = Variants

/**
 * Chip component props.
 * Displays a small, dismissible tag/label with optional delete button.
 * Useful for filters, tags, selected items, and status indicators.
 *
 * @example
 * <Chip label="React" variant="filled" color="primary" />
 *
 * @example
 * <Chip label="Remove" onDelete={(e) => console.log(e)} />
 */
export interface ChipProps {
  /** Left-aligned icon or icon element (e.g., `<CheckCircleIcon />`). */
  icon?: ReactNode
  /** Chip label text or node. Required. Displayed in center. */
  label: ReactNode
  /** Visual style variant. Default: "filled". Outlined for lighter appearance. */
  variant?: ChipVariant
  /** Semantic color (primary, success, warning, error). Default: "primary". */
  color?: ChipColor
  /** Root element class name for custom styling. */
  className?: string
  /**
   * Delete button click handler.
   * Fired when delete icon/button is clicked (mouse or keyboard Enter).
   * Implement to remove chip from list.
   */
  onDelete?: (e: MouseEvent<HTMLButtonElement>) => void
  /**
   * Chip click handler (wrapper div clicked).
   * Fired on mouse click or keyboard Enter/Space on chip (not delete button).
   * Useful for selection, navigation, or filtering.
   */
  onClick?: (e: MouseEvent<HTMLDivElement>) => void
  /**
   * Keyboard event handler on chip wrapper.
   * Allows custom Enter/Space/Arrow key behavior.
   * Note: onDelete takes precedence for delete button on Enter.
   * SSR-safe: internal type mismatch with Omit (see ChipViewProps).
   */
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void
}

/**
 * Internal type for Chip view layer.
 * Corrects onKeyDown handler type from props to match React.KeyboardEventHandler.
 * Use this in the Chip component implementation; export ChipProps for consumer API.
 */
export type ChipViewProps = Omit<ChipProps, "onKeyDown"> & {
  /** Real React.KeyboardEventHandler type (for internal use). */
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>
}
