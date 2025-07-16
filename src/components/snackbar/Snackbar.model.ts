import type { ReactNode } from "react"

// ────────────────────────────────────────────────────────────────────────────────
//  Variants & positions
// ────────────────────────────────────────────────────────────────────────────────
export type SnackbarVariant = "default" | "success" | "error" | "warning" | "info"

export type SnackbarAnchorOrigin = {
  vertical: "top" | "bottom"
  horizontal: "left" | "center" | "right"
}

// ────────────────────────────────────────────────────────────────────────────────
//  Events
// ────────────────────────────────────────────────────────────────────────────────
export type SnackbarCloseReason = "timeout" | "clickaway" | "actionClick" | "closeIcon"
export type SnackbarCloseHandler = (reason: SnackbarCloseReason, event?: unknown) => void

// ────────────────────────────────────────────────────────────────────────────────
//  Props
// ────────────────────────────────────────────────────────────────────────────────
export interface SnackbarProps {
  /** Text or JSX to display */
  message: ReactNode
  /** Whether the snackbar is open – *controlled* prop. */
  open?: boolean
  /** Auto‑dismiss time‑out in **ms** (0 = never). Default **6000ms** */
  autoHideDuration?: number
  /** Visual style */
  variant?: SnackbarVariant
  /** Screen position. Default **{ vertical: "bottom", horizontal: "center" }** */
  anchorOrigin?: SnackbarAnchorOrigin
  /** Optional custom action (e.g. “UNDO” button) */
  action?: ReactNode
  /** Show × close icon */
  closeable?: boolean
  /** z‑index (if you have modals etc.) */
  elevation?: number
  /** Callback fired on close */
  onClose?: SnackbarCloseHandler
  /** Extra className on the root element */
  className?: string
}