import { SnackbarView } from "./Snackbar.view"

import type { SnackbarProps } from "./Snackbar.model"
import type { JSX } from "react"

/** Server‑render *only* if `open` is true so first paint shows the toast. */
export default function SnackbarServer(p: SnackbarProps): JSX.Element | null {
  if (!Boolean(p.open)) return null
  // Mark as read‑only so it doesn’t respond until hydrated
  return <SnackbarView {...p} readOnly />
}
