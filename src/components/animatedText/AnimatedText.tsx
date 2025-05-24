"use client"
import { useEffect, useState, useRef, type FC } from "react"

import type { AnimatedTextProps } from "./AnimatedText.model"

export const AnimatedText: FC<AnimatedTextProps> = ({
  speed = 30,
  delay = 0,
  disabled,
  children,
  ...props
}) => {
  const domRef = useRef<HTMLSpanElement>(null)
  const [startTyping, setStartTyping] = useState<boolean>(false)
  const [currentText, setCurrentText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (Boolean(disabled)) return

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const delayTimeoutId = setTimeout(() => {
          setStartTyping(entry.isIntersecting)
        }, delay)

        return () => clearTimeout(delayTimeoutId)
      })
    })
    observer.observe(domRef.current as Element)
  }, [delay, disabled])

  useEffect(() => {
    if (!startTyping || currentIndex >= children.length) return

    const typingTimeoutId = setTimeout(() => {
      setCurrentText(prevText => prevText + children[currentIndex])
      setCurrentIndex(prevIndex => prevIndex + 1)
    }, speed)

    return () => clearTimeout(typingTimeoutId)
  }, [startTyping, currentIndex, children, speed])

  return (
    <span {...props} ref={domRef}>
      {currentText}
    </span>
  )
}
