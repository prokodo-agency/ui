import type { SnackbarVariant } from "./Snackbar.model"
import type { ReactNode } from "react"

export interface SnackbarPayload {
  id?: string // auto-generated if missing
  className?: string
  message: ReactNode
  variant?: SnackbarVariant
  autoHideDuration?: number
  action?: ReactNode
  anchorOrigin?: {
    vertical: "top" | "bottom"
    horizontal: "left" | "center" | "right"
  }
  closeable?: boolean
}

export interface SnackbarContextValue {
  enqueue: (s: SnackbarPayload) => string // returns id
  close: (id: string) => void
}

export type SnackbarProviderProps = {
  className?: string
  /** Max snackbars shown at once (oldest auto-closed). */
  maxSnack?: number
  /** Default anchor for every snackbar (overridable per payload). */
  anchorOrigin?: SnackbarPayload["anchorOrigin"]
  children: ReactNode
}
