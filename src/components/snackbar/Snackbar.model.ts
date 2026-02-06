import type { IconProps } from "../icon"
import type { HTMLAttributes, ReactNode } from "react"

// ────────────────────────────────────────────────────────────────────────────────
//  Variants & positions
// ────────────────────────────────────────────────────────────────────────────────
/**
 * Visual variants for Snackbar.
 */
export type SnackbarVariant =
  | "default"
  | "success"
  | "error"
  | "warning"
  | "info"

/**
 * Snackbar screen position.
 */
export type SnackbarAnchorOrigin = {
  /** Vertical anchor. */
  vertical: "top" | "bottom"
  /** Horizontal anchor. */
  horizontal: "left" | "center" | "right"
}

// ────────────────────────────────────────────────────────────────────────────────
//  Events
// ────────────────────────────────────────────────────────────────────────────────
/**
 * Reasons for snackbar close events.
 */
export type SnackbarCloseReason =
  | "timeout"
  | "clickaway"
  | "actionClick"
  | "closeIcon"
/**
 * Snackbar close callback signature.
 */
export type SnackbarCloseHandler = (
  reason: SnackbarCloseReason,
  event?: unknown,
) => void

// ────────────────────────────────────────────────────────────────────────────────
//  Props
// ────────────────────────────────────────────────────────────────────────────────
/**
 * Snackbar props.
 * Shows transient feedback messages with optional actions.
 *
 * @example
 * <Snackbar message="Saved" open autoHideDuration={3000} />
 *
 * @example
 * <Snackbar
 *   message="Deleted"
 *   action={<button>Undo</button>}
 *   variant="warning"
 * />
 */
export interface SnackbarProps {
  /** Text or JSX to display. */
  message: ReactNode
  /** Whether the snackbar is open (controlled). */
  open?: boolean
  /** Auto‑dismiss timeout in ms (0 = never). Default: 6000. */
  autoHideDuration?: number
  /** Visual style variant. */
  variant?: SnackbarVariant
  /** Screen position. Default: { vertical: "bottom", horizontal: "center" }. */
  anchorOrigin?: SnackbarAnchorOrigin
  /** Optional custom action (e.g., “UNDO” button). */
  action?: ReactNode
  /** Show close icon. */
  closeable?: boolean
  /** z-index (useful with modals). */
  elevation?: number
  /** Callback fired on close. */
  onClose?: SnackbarCloseHandler
  /** Extra className on the root element. */
  className?: string
  /** Override props of close button. */
  closeButtonProps?: HTMLAttributes<HTMLButtonElement>
  /** Override props of close icon. */
  closeIconProps?: IconProps
}
