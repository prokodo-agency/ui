"use client"

import { type FC, useEffect, useState, useRef } from "react"

import { isNumber } from "@/helpers/validations"

import { create } from "@/helpers/bem"

import styles from "./Animated.module.scss"

import type { AnimatedProps } from "./Animated.model"

const bem = create(styles, "Animated")

export const Animated: FC<AnimatedProps> = ({
  className,
  disabled = false,
  delay = 0,
  speed = "normal",
  animation = "fade-in",
  children,
  intersectionObserverOptions = {},
  onAnimate,
  ...props
}) => {
  const [isVisible, setVisible] = useState(false)
  const domRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<number | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!domRef.current) return

    const handleIntersection: IntersectionObserverCallback = entries => {
      const [entry] = entries
      const isIntersecting = entry?.isIntersecting ?? false

      if (isIntersecting && !isVisible) {
        // Clear any existing timeout before setting a new one
        if (timeoutRef.current !== null && isNumber(timeoutRef.current)) {
          clearTimeout(timeoutRef.current)
        }

        // Set the timeout with the specified delay
        timeoutRef.current = window.setTimeout(() => {
          setVisible(true)
          onAnimate?.(true) // Trigger animation after the delay
        }, delay)
      }

      if (!isIntersecting && isVisible) {
        setVisible(false)
      }
    }

    // Initialize IntersectionObserver
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      ...intersectionObserverOptions,
    })

    observerRef.current.observe(domRef.current)

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
      if (timeoutRef.current !== null && isNumber(timeoutRef.current))
        clearTimeout(timeoutRef.current)
    }
  }, [onAnimate, delay, intersectionObserverOptions, isVisible])

  return (
    <div
      ref={domRef}
      className={bem(
        undefined,
        {
          "is-visible": !!isVisible,
          "is-disabled": !!disabled,
          [`has-${speed}-speed`]: !!speed,
          [`animate-${animation}`]: !!animation,
        },
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
