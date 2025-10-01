"use client"

import {
  Children,
  useState,
  useEffect,
  useCallback,
  useRef,
  useImperativeHandle,
  type JSX,
  type KeyboardEvent,
  type TouchEvent,
} from "react"

import { Button } from "@/components/button"
import { Lottie } from "@/components/lottie"
import { Skeleton } from "@/components/skeleton"
import { create } from "@/helpers/bem"
import { isNumber } from "@/helpers/validations"
import { useResponsiveValue } from "@/hooks/useResponsiveValue"

import styles from "./Carousel.module.scss"
import {
  PREV,
  NEXT,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleMouseDown,
  handleMouseUp,
} from "./Carousel.services"

import type { CarouselProps, CarouselDirection } from "./Carousel.model"

const bem = create(styles, "Carousel")

export default function CarouselClient(props: CarouselProps): JSX.Element {
  const {
    ref,
    autoplay,
    enableControl,
    itemsToShow = 1,
    className,
    classNameControls,
    classNameButtons,
    classNameWrapper,
    classNameItem,
    classNameDots,
    classNameDot,
    classNameDotActive,
    responsive,
    onKeyDown,
    onMouseEnter,
    onMouseLeave,
    onTouchEnd,
    onTouchMove,
    onTouchStart,
    onMouseDown,
    onMouseUp,
    children,
    ...rest
  } = props

  /* ----- refs & state ------------------------------------ */
  const carouselContainerRef = useRef<HTMLDivElement>(null)
  // Resolve itemsToShow responsively if config provided
  const { value: resolvedItemsToShow, ref: containerRef } =
    useResponsiveValue<number>({
      fallback: responsive?.fallback ?? itemsToShow,
      breakpoints: responsive?.breakpoints,
      valuesByBreakpoint: responsive?.valuesByBreakpoint,
      valuesByQueries: responsive?.valuesByQueries,
      containerRules: responsive?.containerRules,
    })

  // Prefer responsive value when provided; else the fixed prop
  const effectiveItemsToShow = responsive ? resolvedItemsToShow : itemsToShow

  // merge refs so both our internal ref and container-query ref get the element
  const setHostRef = (el: HTMLDivElement | null) => {
    // our original container
    carouselContainerRef.current = el
    // the hook’s container (only meaningful if containerRules used)
    containerRef.current = el
  }

  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const mouseStartX = useRef(0)
  const mouseEndX = useRef(0)

  const [mobileHint, setMobileHint] = useState(true)
  const [current, setCurrent] = useState(effectiveItemsToShow)
  const [transitioning, setTrans] = useState(false)
  const [isPlaying, setPlaying] = useState(Boolean(autoplay))
  const [mouseActive, setMouse] = useState(false)

  const childrenArr = Children.toArray(children)
  const num = childrenArr.length

  /* build extended items (head & tail clones) */
  const items = [
    ...childrenArr.slice(-effectiveItemsToShow),
    ...childrenArr,
    ...childrenArr.slice(0, effectiveItemsToShow),
  ]

  /* hide swipe hint after 1.5 s */
  useEffect(() => {
    const id = setTimeout(() => setMobileHint(false), 1500)
    return () => clearTimeout(id)
  }, [])

  /* slide helpers */
  const slide = useCallback(
    (dir: CarouselDirection) => {
      if (transitioning) return
      setTrans(true)
      const next = dir === NEXT ? current + 1 : current - 1
      setCurrent(next)

      setTimeout(() => {
        if (next >= num + effectiveItemsToShow) setCurrent(effectiveItemsToShow)
        else if (next < effectiveItemsToShow) setCurrent(num)
        setTrans(false)
      }, 300)
    },
    [current, num, effectiveItemsToShow, transitioning],
  )

  const slideTo = useCallback(
    (i: number) => {
      if (transitioning) return
      setTrans(true)
      const target = i + effectiveItemsToShow
      setCurrent(target)
      setTimeout(() => {
        if (target >= num + effectiveItemsToShow) setCurrent(target - num)
        else if (target < effectiveItemsToShow) setCurrent(num + target)
        setTrans(false)
      }, 300)
    },
    [effectiveItemsToShow, num, transitioning],
  )

  /* autoplay */
  useEffect(() => {
    if (!isNumber(autoplay) || (autoplay as number) <= 0) return
    if (!isPlaying) return
    const id = setInterval(() => slide(NEXT), autoplay)
    return () => clearInterval(id)
  }, [autoplay, isPlaying, slide])

  /* imperative API */
  useImperativeHandle(ref, () => ({
    slidePrev: () => slide(PREV),
    slideNext: () => slide(NEXT),
    carouselContainer: carouselContainerRef.current,
  }))

  const getTransformValue = () => {
    const offset = -current * (100 / effectiveItemsToShow)
    return `translateX(${offset}%)`
  }

  /* ------------- render ---------------------------------- */
  if (num === 0) return <Skeleton height="200px" variant="rectangular" width="100%" />

  return (
    <div
      {...rest}
      ref={setHostRef}
      role="button"
      tabIndex={0}
      className={bem(
        undefined,
        { "is-active": mouseActive },
        className,
      )}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(e)
        switch (e.key) {
          case "ArrowLeft":
            slide("PREV")
            break
          case "ArrowRight":
            slide("NEXT")
            break
        }
      }}
      onMouseDown={(e) => {
        onMouseDown?.(e)
        handleMouseDown(e, mouseStartX)
        setMouse(true)
      }}
      onMouseEnter={(e) => {
        onMouseEnter?.(e)
        setPlaying(false)
      }}
      onMouseLeave={(e) => {
        onMouseLeave?.(e)
        setPlaying(true)
      }}
      onMouseUp={(e) => {
        onMouseUp?.(e)
        handleMouseUp(e, mouseStartX, mouseEndX, slide)
        setMouse(false)
      }}
      onTouchEnd={(e) => {
        onTouchEnd?.(e)
        handleTouchEnd(touchStartX, touchEndX, slide)
      }}
      onTouchMove={(e) => {
        onTouchMove?.(e)
        handleTouchMove(e, touchEndX)
      }}
      onTouchStart={(e: TouchEvent<HTMLDivElement>) => {
        onTouchStart?.(e)
        handleTouchStart(e, touchStartX)
      }}
    >
      <div
        className={bem("wrapper", undefined, classNameWrapper)}
        style={{
          transform: getTransformValue(),
          transition: transitioning ? "transform 0.3s ease-in-out" : "none",
        }}
      >
        {items.map((child, i) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={`cl-${i}`}
            className={bem("item", undefined, classNameItem)}
            style={{ width: `${100 / effectiveItemsToShow}%` }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* swipe hint */}
      <div
        className={bem("mobile__tutorial", {
          "is-hidden": !mobileHint,
        })}
      >
        <div className={bem("mobile__tutorial__animation")}>
          <Lottie animation="https://lottie.host/7da0edc5-d79e-497c-bcce-ab9dd8e9458d/lahjQ7ICxg.lottie" />
        </div>
      </div>

      {/* controls & dots */}
      <footer className={bem("controls", undefined, classNameControls)}>
        {Boolean(enableControl) && (
          <Button
            aria-label="previous"
            className={bem("button", undefined, classNameButtons)}
            iconProps={{ name: "ArrowLeft01Icon", size: "md", color: "white" }}
            variant="outlined"
            onClick={() => slide(PREV)}
          />
        )}

        <span className={bem("dots", undefined, classNameDots)}>
          {childrenArr.map((_, i) => {
            const active = i === (current - effectiveItemsToShow + num) % num
            return (
              <button
                // eslint-disable-next-line react/no-array-index-key
                key={`dot-${i}`}
                className={bem("dots__dot", { "is-active": active }, `${classNameDot} ${active ? (classNameDotActive ?? "") : ""}`)}
                onClick={() => slideTo(i)}
                onKeyDown={(e) => e.key === "Enter" && slideTo(i)}
              />
            )
          })}
        </span>

        {Boolean(enableControl) && (
          <Button
            aria-label="next"
            className={bem("button", undefined, classNameButtons)}
            iconProps={{ name: "ArrowRight01Icon", size: "md", color: "white" }}
            variant="outlined"
            onClick={() => slide(NEXT)}
          />
        )}
      </footer>
    </div>
  )
}
