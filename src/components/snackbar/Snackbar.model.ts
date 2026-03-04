import type { IconProps } from "../icon"
import type { HTMLAttributes, ReactNode } from "react"

// ────────────────────────────────────────────────────────────────────────────────
//  Variants & positions
// ────────────────────────────────────────────────────────────────────────────────
/**
 * Color tokens for Snackbar.
 */
export type SnackbarColor = "default" | "success" | "error" | "warning" | "info"

/** @deprecated Use {@link SnackbarColor} instead. */
export type SnackbarVariant = SnackbarColor

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
 *   color="warning"
 * />
 */
export interface SnackbarProps {
  /** Text or JSX to display. */
  message: ReactNode
  /** Whether the snackbar is open (controlled). */
  open?: boolean
  /** Auto‑dismiss timeout in ms (0 = never). Default: 6000. */
  autoHideDuration?: number
  /** Visual color token. */
  color?: SnackbarColor
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
