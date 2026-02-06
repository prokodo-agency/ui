import type { SnackbarProps } from "./Snackbar.model"
import type { ReactNode } from "react"

/**
 * Snackbar data to enqueue via SnackbarProvider.
 * Inherits all SnackbarProps with optional auto-generated id.
 */
export type SnackbarPayload = SnackbarProps & {
  /** Optional id. Auto-generated if missing. */
  id?: string
}

/**
 * Context value provided by SnackbarProvider.
 */
export interface SnackbarContextValue {
  /**
   * Enqueue a snackbar.
   * @returns Generated or provided id.
   */
  enqueue: (s: SnackbarPayload) => string
  /**
   * Close a snackbar by id.
   */
  close: (id: string) => void
}

/**
 * SnackbarProvider props.
 * Provides a context and manager for queueing snackbars across the app.
 *
 * @example
 * <SnackbarProvider maxSnack={3}>
 *   <App />
 * </SnackbarProvider>
 */
export type SnackbarProviderProps = {
  /** Optional class name for the provider wrapper. */
  className?: string
  /** Max snackbars shown at once (oldest auto-closed). */
  maxSnack?: number
  /** Default anchor for every snackbar (overridable per payload). */
  anchorOrigin?: SnackbarPayload["anchorOrigin"]
  /** Child components that can use useSnackbar hook. */
  children: ReactNode
}
