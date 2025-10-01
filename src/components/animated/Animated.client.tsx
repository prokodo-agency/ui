'use client'

import { useEffect, useState, useRef, type JSX } from 'react'

import { isNumber } from '@/helpers/validations'

import { AnimatedView } from './Animated.view'

import type { AnimatedProps } from './Animated.model'

export default function AnimatedClient(props: AnimatedProps): JSX.Element {
  const {
    delay = 0,
    onAnimate,
    disabled,
    speed,
    animation,
    className,
    children,
    ...domRest
  } = props

  const [isVisible, setVisible] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (Boolean(disabled)) return
    timeoutRef.current = window.setTimeout(() => {
      setVisible(true)
      onAnimate?.(true)
    }, delay)
    return () => {
      if (timeoutRef.current !== null && isNumber(timeoutRef.current)) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [delay, disabled, onAnimate])

  return (
    <AnimatedView
      animation={animation}
      className={className}
      disabled={disabled}
      isVisible={isVisible}
      speed={speed}
      {...domRest}
    >
      {children}
    </AnimatedView>
  )
}
