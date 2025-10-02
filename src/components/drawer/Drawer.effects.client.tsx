"use client"
import { useEffect, useRef } from "react"

import { isString } from "@/helpers/validations"

type Props = {
  isOpen: boolean
  containerRef?: React.RefObject<HTMLDivElement | null>
  closeButtonRef?: React.RefObject<HTMLButtonElement | null>
  onClose?: (reason: "backdropClick" | "escapeKeyDown") => void
  useSlide?: boolean
}

const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export const DrawerEffectsLoader = ({
  isOpen,
  containerRef,
  closeButtonRef,
  onClose,
}: Props): null => {
  const lastFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const { body, documentElement } = document
    const { scrollY } = window

    const prev = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overscroll: documentElement.style.overscrollBehavior,
    }

    // iOS-safe lock
    body.style.overflow = "hidden"
    body.style.position = "fixed"
    body.style.top = `-${scrollY}px`
    body.style.width = "100%"
    documentElement.style.overscrollBehavior = "none"

    return () => {
      body.style.overflow = prev.overflow
      body.style.position = prev.position
      body.style.top = prev.top
      body.style.width = prev.width
      documentElement.style.overscrollBehavior = prev.overscroll
      window.scrollTo(0, scrollY)
    }
  }, [isOpen])

  // Focus management: save/restore focus + initial focus
  useEffect(() => {
    const container = containerRef?.current
    if (!container) return

    if (isOpen) {
      lastFocused.current = (document.activeElement as HTMLElement) ?? null

      // Make container programmatically focusable if needed
      if (!container.hasAttribute("tabindex"))
        container.setAttribute("tabindex", "-1")

      // Initial focus: close button or container
      const first =
        closeButtonRef?.current ??
        (container.querySelector(FOCUSABLE) as HTMLElement) ??
        container
      first.focus({ preventScroll: true })
    } else {
      // restore focus
      lastFocused.current?.focus?.()
    }
  }, [isOpen, containerRef, closeButtonRef])

  // Focus trap + Escape to close
  useEffect(() => {
    if (!isOpen) return
    const container = containerRef?.current
    if (!container) return

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation()
        onClose?.("escapeKeyDown")
        return
      }
      if (e.key !== "Tab") return

      const nodes = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter(
        el =>
          !Boolean(el.hasAttribute("inert")) &&
          !isString(el.getAttribute("aria-hidden")),
      )
      const [first] = nodes
      const last = nodes.at(-1)
      if (!first || !last) return

      // wrap
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeydown, true)
    return () => document.removeEventListener("keydown", onKeydown, true)
  }, [isOpen, containerRef, onClose])

  return null
}
