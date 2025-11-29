import { create } from "@/helpers/bem"

import { Icon } from "../icon"

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
  closeButtonProps,
  closeIconProps,
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
          type="button"
          {...closeButtonProps}
          className={bem("close", undefined, closeButtonProps?.className)}
          onClick={e => {
            onClose?.("closeIcon")
            closeButtonProps?.onClick?.(e)
          }}
        >
          <Icon
            aria-hidden="true"
            name="Cancel01Icon"
            size="md"
            {...closeIconProps}
          />
        </button>
      )}
    </div>
  )
}
