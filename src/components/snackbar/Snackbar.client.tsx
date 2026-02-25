"use client"
import { useEffect, useRef, useState, useCallback, memo, type JSX } from "react"

import { SnackbarView } from "./Snackbar.view"

import type { SnackbarProps, SnackbarCloseReason } from "./Snackbar.model"

function SnackbarClient({
  /* istanbul ignore next */
  open: openProp = /* istanbul ignore next */ false,
  autoHideDuration = 6_000,
  onClose,
  ...rest
}: SnackbarProps): JSX.Element | null {
  const [open, setOpen] = useState(openProp)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleClose = useCallback(
    (reason: SnackbarCloseReason, event?: unknown): void => {
      setOpen(false)
      onClose?.(reason, event)
    },
    [onClose],
  )

  useEffect(() => setOpen(openProp), [openProp])

  useEffect(() => {
    if (!open || autoHideDuration === 0) return

    // clear any previous timer
    if (timer.current) clearTimeout(timer.current)

    timer.current = setTimeout(() => handleClose("timeout"), autoHideDuration)

    // cleanup (always returns void, never null)
    return () => {
      /* istanbul ignore next */
      if (timer.current) clearTimeout(timer.current)
    }
  }, [open, autoHideDuration, handleClose])

  if (!open) return null
  return <SnackbarView {...rest} onClose={handleClose} />
}

export default memo(SnackbarClient)
