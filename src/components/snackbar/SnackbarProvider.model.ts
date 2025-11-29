import type { SnackbarProps } from "./Snackbar.model"
import type { ReactNode } from "react"

export type SnackbarPayload = SnackbarProps & {
  id?: string // auto-generated if missing
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
