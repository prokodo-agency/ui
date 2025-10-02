import { create } from "@/helpers/bem"

import styles from "./Snackbar.module.scss"

import type {
  SnackbarProps,
  SnackbarCloseHandler,
  SnackbarAnchorOrigin,
} from "./Snackbar.model"
import type { JSX } from "react"

const bem = create(styles, "Snackbar")

export interface SnackbarViewProps extends Omit<SnackbarProps, "open"> {
  /** Hydration wrapper passes this when toast still interactive */
  onClose?: SnackbarCloseHandler
  /** When server‑rendered we add readOnly */
  readOnly?: boolean
}

export function SnackbarView({
  message,
  variant = "default",
  anchorOrigin = { vertical: "bottom", horizontal: "center" },
  action,
  closeable = true,
  elevation = 10,
  className,
  onClose,
  readOnly,
}: SnackbarViewProps): JSX.Element {
  const pos: SnackbarAnchorOrigin = anchorOrigin
  return (
    <div
      aria-live="polite"
      role="status"
      style={{ zIndex: elevation }}
      className={bem(
        undefined,
        {
          [variant]: true,
          readonly: Boolean(readOnly),
          [pos.vertical]: true,
          [pos.horizontal]: true,
        },
        className,
      )}
    >
      <span className={bem("message")}>{message}</span>
      {action !== undefined && <span className={bem("action")}>{action}</span>}
      {closeable && (
        <button
          aria-label="Close"
          className={bem("close")}
          type="button"
          onClick={() => onClose?.("closeIcon")}
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  )
}
