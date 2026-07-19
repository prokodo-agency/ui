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
      // `preventScroll` keeps the page from jumping to the top when the modal
      // grabs focus (the close button lives at the top of the portal).
      closeButtonRef.current?.focus({ preventScroll: true })
    }
  }, [isOpen])

  const closeDialog = useCallback(
    (reson?: DialogChangeReson) => {
      setIsOpen(false)
      onClose?.()
      setTimeout(() => {
        /* istanbul ignore next */
        onChange?.({}, reson ?? "backdropClick", false)
        // restore focus (without scrolling the page back to the trigger)
        triggerRef.current?.focus({ preventScroll: true })
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

  // Keep `open` a fully controlled prop: when the parent flips it back to
  // `false` (e.g. a custom cancel button that lives outside this component),
  // mirror that into the internal visibility state so the dialog actually
  // closes instead of staying mounted-open.
  useEffect(() => {
    if (!open) setIsOpen(false)
  }, [open])

  // Lock page scroll while the Dialog is open. The scroll container varies by
  // app: sometimes it's <html> (default), sometimes the app makes <body> the
  // scroller (e.g. `body { overflow: hidden; height: 100vh }`). Locking the
  // WRONG element with `overflow: hidden` collapses the scroll offset to 0, so
  // the page visibly jumps to the top behind the backdrop. We therefore detect
  // the element that actually holds the scroll offset, lock + save it, restore
  // on close, and compensate for the removed scrollbar to avoid a layout shift.
  useEffect(() => {
    if (!isOpen) return
    const html = document.documentElement
    const { body } = document
    // The real scroll container is whichever of body/html currently holds a
    // scroll offset, else whichever can actually scroll its content.
    const scroller: HTMLElement =
      body.scrollTop > 0
        ? body
        : html.scrollTop > 0
          ? html
          : body.scrollHeight > body.clientHeight
            ? body
            : html
    const { scrollTop } = scroller
    const scrollbarWidth = window.innerWidth - html.clientWidth
    const prevOverflow = scroller.style.overflow
    const prevPaddingRight = scroller.style.paddingRight
    scroller.style.overflow = "hidden"
    if (scrollbarWidth > 0) scroller.style.paddingRight = `${scrollbarWidth}px`
    return () => {
      scroller.style.overflow = prevOverflow
      if (prevPaddingRight) scroller.style.paddingRight = prevPaddingRight
      else scroller.style.removeProperty("padding-right")
      scroller.scrollTop = scrollTop
    }
  }, [isOpen])

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
              last.focus({ preventScroll: true })
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault()
              first.focus({ preventScroll: true })
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
