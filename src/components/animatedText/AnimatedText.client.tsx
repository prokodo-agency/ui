"use client"

import { useEffect, useState, type JSX } from "react"

import { AnimatedTextView } from "./AnimatedText.view"

import type { AnimatedTextProps } from "./AnimatedText.model"

export default function AnimatedTextClient(
  {
    speed = 30,
    delay = 0,
    disabled,
    children,
    ...rest
  }: AnimatedTextProps,
): JSX.Element {
  const [index, setIndex] = useState(0)

  /* start typing after the optional delay */
  useEffect(() => {
    if (Boolean(disabled)) return

    const t0 = window.setTimeout(() => {
      const id = window.setInterval(() => {
        setIndex((i) => {
          if (i + 1 >= children?.length) {
            clearInterval(id)
            return children?.length
          }
          return i + 1
        })
      }, speed)
    }, delay)

    return () => clearTimeout(t0)
  }, [children?.length, delay, disabled, speed])

  return (
    <AnimatedTextView
      {...rest}
      text={children?.slice(0, index)}
    />
  )
}
