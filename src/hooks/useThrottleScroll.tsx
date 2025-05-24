import { useEffect, useRef } from "react"

import { throttleLayoutEffect } from "@/helpers/effect"

/**
 * Custom hook to throttle scroll events using requestAnimationFrame for smooth performance.
 */
export const useThrottledScroll = (callback: () => void): void => {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const handleScroll = throttleLayoutEffect(() => {
      savedCallback.current()
    })

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])
}
