'use client'
import {
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  useRef,
  type Ref,
} from 'react'
import { DrawerView } from './Drawer.view'
import type {
  DrawerRef,
  DrawerProps,
  DrawerChangeReason
} from './Drawer.model'

/**
 * Client‐side wrapper around DrawerView.
 * Manages:
 * - mounting/unmounting (so we can animate open/close)
 * - focus management (trap  restore focus to trigger)
 * - ESC‐key handler
 * - clicking outside (handled in DrawerView)
 */
function DrawerClient(
  { open = false, closeOnBackdropClick = true, onChange, ...props }: DrawerProps,
  ref: Ref<DrawerRef>
) {
  // The element that triggered open; we restore focus to it when drawer closes.
  const triggerRef = useRef<HTMLElement | null>(null)

  // Ref to the “×” close button for initial focus.
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  // Ref to the container (used for focus‐trap if desired in future).
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Same for isOpen: start truthy SSR, but on client start closed until we run effects.
  const [isOpen, setIsOpen] = useState(() => open)

  /** Imperative handle */
  const openDrawer = useCallback(() => {
    // Save the element that had focus, so we can restore later.
    triggerRef.current = document.activeElement as HTMLElement | null
    // Then immediately set isOpen=true so CSS animates “slide in”.
    setIsOpen(true)
  }, [])

  const closeDrawer = useCallback(
    (reason?: DrawerChangeReason) => {
      // Trigger CSS “slide out” by removing `open` class.
      setIsOpen(false)
      // After animation finishes, unmount and notify parent:
      onChange?.({}, reason ?? 'backdropClick')
      // Restore focus to trigger
      triggerRef.current?.focus()
    },
    [onChange]
  )

  useImperativeHandle(
    ref,
    () => ({
      openDrawer,
      closeDrawer
    }),
    [openDrawer, closeDrawer]
  )

  // Focus the close button when drawer is fully mounted & open.
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus()
    }
  }, [isOpen])

  // ESC‐key handler (only active while mounted).
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeDrawer('escapeKeyDown')
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, closeDrawer])

  return (
    <DrawerView
      {...props}
      open={isOpen}
      onClose={closeDrawer}
      closeButtonRef={closeButtonRef}
      containerRef={containerRef}
      backdropProps={{
        onMouseDown: () => {
          if (isOpen && closeOnBackdropClick) {
            closeDrawer?.('backdropClick')
          }
        }
      }}
    />
  )
}

export default forwardRef<DrawerRef, DrawerProps>(DrawerClient)
