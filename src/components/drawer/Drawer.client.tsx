'use client'
import {
  forwardRef,
  useLayoutEffect,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  useRef,
  type Ref,
} from 'react'

import { DrawerView } from './Drawer.view'

import type { DrawerRef, DrawerProps, DrawerChangeReason } from './Drawer.model'

function DrawerClient(
  { open = false, closeOnBackdropClick = true, onChange, ...props }: DrawerProps,
  ref: Ref<DrawerRef>
) {
  // element to restore focus to on close
  const triggerRef = useRef<HTMLElement | null>(null)

  // refs passed to the View
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // internal open state (drives classes/animation)
  const [isOpen, setIsOpen] = useState<boolean>(() => Boolean(open))
  // mount state: when false, DrawerView is not rendered at all (no tabbables exist)
  const [mounted, setMounted] = useState<boolean>(() => Boolean(open))

  // make sure we never “flash” open before styles apply
  useLayoutEffect(() => {
    if (!open) {
      setIsOpen(false)
      setMounted(false) // if server didn't render (step 1), this is a no-op
    }
    // if open === true initially, we want to render immediately
  }, [open])

  // —— controlled prop sync ——
  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement | null
      if (!mounted) setMounted(true)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          containerRef.current?.getBoundingClientRect()
          setIsOpen(true)
        })
      })
    } else {
      setIsOpen(false) // slide out; unmount on transitionend
    }

  }, [open, mounted])

  // unmount after close
  useEffect(() => {
    if (isOpen || !mounted) return
    const node = containerRef.current
    if (!node) { setMounted(false); return }

    const onEnd = (e: TransitionEvent) => {
      if (e.target !== node) return        // only the container's own transition
      node.removeEventListener('transitionend', onEnd)
      setMounted(false)
      triggerRef.current?.focus?.()
    }
    node.addEventListener('transitionend', onEnd)

    const t = setTimeout(() => {           // fallback
      node.removeEventListener('transitionend', onEnd)
      setMounted(false)
      triggerRef.current?.focus?.()
    }, 450)

    return () => {
      node.removeEventListener('transitionend', onEnd)
      clearTimeout(t)
    }
  }, [isOpen, mounted])

  const closeDrawer = useCallback(
    (reason?: DrawerChangeReason) => {
      setIsOpen(false)      // slide out
      onChange?.({}, reason ?? 'backdropClick')
      // focus will be restored after unmount; also do it here as a safety
      triggerRef.current?.focus?.()
    },
    [onChange]
  )

  // —— ESC key while open ——
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeDrawer('escapeKeyDown')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, closeDrawer])

  // —— initial focus when opened ——
  useEffect(() => {
    if (!isOpen) return
    // wait a tick for DrawerView to render content
    const id = requestAnimationFrame(() => {
      closeButtonRef.current?.focus?.()
    })
    return () => cancelAnimationFrame(id)
  }, [isOpen])

  // —— imperative API ——
  const openDrawer = useCallback(() => {
    triggerRef.current = document.activeElement as HTMLElement | null
    setMounted(true) // create DOM first

    // wait for DOM to mount & styles to apply, then flip open
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // tiny reflow ensures initial transform/opacity are committed
        containerRef.current?.getBoundingClientRect()
        setIsOpen(true)
      })
    })
  }, [])

  useImperativeHandle(ref, () => ({ openDrawer, closeDrawer }), [openDrawer, closeDrawer])

  // When closed and not animating, render nothing → no tabbables on first load
  if (!mounted) return null

  return (
    <DrawerView
      {...props}
      closeButtonRef={closeButtonRef}
      containerRef={containerRef}
      open={isOpen}
      backdropProps={{
        onMouseDown: () => {
          if (isOpen && closeOnBackdropClick) {
            closeDrawer('backdropClick')
          }
        },
      }}
      onClose={closeDrawer}
      onMouseDown={e => e.stopPropagation()}
    />
  )
}

export default forwardRef<DrawerRef, DrawerProps>(DrawerClient)
