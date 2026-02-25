"use client"
import {
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react"

import { DialogView } from "./Dialog.view"

import type { DialogRef, DialogChangeReson, DialogProps } from "./Dialog.model"

const FADE_DURATION = 300

function DialogClient(
  {
    open = false,
    closeOnBackdropClick = true,
    onChange,
    onClose,
    ...props
  }: DialogProps,
  ref: React.Ref<DialogRef>,
) {
  const triggerRef = useRef<HTMLElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(open)

  const openDialog = useCallback(() => {
    triggerRef.current = document.activeElement as HTMLElement | null
    setIsOpen(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus()
    }
  }, [isOpen])

  const closeDialog = useCallback(
    (reson?: DialogChangeReson) => {
      setIsOpen(false)
      onClose?.()
      setTimeout(() => {
        /* istanbul ignore next */
        onChange?.({}, reson ?? "backdropClick", false)
        // restore focus
        triggerRef.current?.focus()
      }, FADE_DURATION)
    },
    [onChange, onClose],
  )

  useImperativeHandle(ref, () => ({ openDialog, closeDialog }), [
    openDialog,
    closeDialog,
  ])

  useEffect(() => {
    if (open) openDialog()
  }, [open, openDialog])

  useEffect(() => {
    if (!isOpen) return
    /* istanbul ignore next */
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        closeDialog("escapeKeyDown")
      }
      if (e.key === "Tab" && containerRef.current) {
        // Focus-Trap: alle focusable im Container
        const focusable = containerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length > 0) {
          const first = focusable[0]!
          const last = focusable[focusable.length - 1]!
          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault()
              last.focus()
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault()
              first.focus()
            }
          }
        }
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [isOpen, closeDialog])

  // Hier den transitionState mitgeben!
  return (
    <DialogView
      {...props}
      closeButtonRef={closeButtonRef}
      containerRef={containerRef}
      open={isOpen}
      wrapperProps={{
        onMouseDown: () => {
          if (closeOnBackdropClick) closeDialog("backdropClick")
        },
      }}
      onClose={closeDialog}
      onMouseDown={e => e.stopPropagation()}
      onCloseKeyDown={e => {
        if (e.key === "Enter") {
          closeDialog()
        }
      }}
    />
  )
}

// Default-Export mit forwardRef
export default forwardRef(DialogClient)
