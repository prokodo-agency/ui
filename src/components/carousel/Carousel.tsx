"use client"
import {
  type FC,
  type ReactNode,
  type KeyboardEvent,
  type MouseEvent,
  type TouchEvent,
  Children,
  useEffect,
  useState,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react"

import { create } from "@/helpers/bem"

import { Button } from "../button"
import { Lottie } from "../lottie"

import styles from "./Carousel.module.scss"
import {
  NEXT,
  PREV,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleMouseDown,
  handleMouseUp,
} from "./Carousel.services"

import type { CarouselProps, CarouselDirection } from "./Carousel.model"

const bem = create(styles, "Carousel")

export const Carousel: FC<CarouselProps> = ({
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
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  onTouchEnd,
  onTouchMove,
  onTouchStart,
  onMouseDown,
  onMouseUp,
  children,
  ...props
}) => {
  const carouselContainerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)
  const mouseStartX = useRef<number>(0)
  const mouseEndX = useRef<number>(0)

  const [mobileTutorialVisible, setMobileTutorialVisible] = useState(true)
  const [currentIndex, setCurrentIndex] = useState<number>(itemsToShow)
  const [mouseActive, setMouseActive] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(Boolean(autoplay))
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)
  const childrenArray = Children.toArray(children)
  const [items, setItems] = useState<ReactNode[]>([])

  const numItems = childrenArray.length

  useEffect(() => {
    const newItems = [
      ...childrenArray.slice(-itemsToShow),
      ...childrenArray,
      ...childrenArray.slice(0, itemsToShow),
    ]

    if (newItems !== items) {
      setItems(newItems)
      setCurrentIndex(itemsToShow)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsToShow])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMobileTutorialVisible(false)
    }, 1500)

    return () => clearTimeout(timeout)
  }, [])

  const slide = useCallback(
    (direction: CarouselDirection) => {
      if (isTransitioning) return

      setIsTransitioning(true)
      let newIndex = currentIndex

      if (direction === NEXT) {
        newIndex = currentIndex + 1
      } else if (direction === PREV) {
        newIndex = currentIndex - 1
      }

      setCurrentIndex(newIndex)

      setTimeout(() => {
        if (newIndex >= numItems + itemsToShow) {
          setCurrentIndex(itemsToShow)
          setIsTransitioning(false)
        } else if (newIndex < itemsToShow) {
          setCurrentIndex(numItems)
          setIsTransitioning(false)
        } else {
          setIsTransitioning(false)
        }
      }, 300)
    },
    [isTransitioning, currentIndex, itemsToShow, numItems],
  )

  useEffect(() => {
    if (typeof autoplay !== "number" || autoplay <= 0) return
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        slide(NEXT)
      }, autoplay)
    }
    return () => {
      clearInterval(interval)
    }
  }, [slide, isPlaying, autoplay])

  const slideToIndex = useCallback(
    (index: number) => {
      if (isTransitioning) return
      setIsTransitioning(true)

      const targetIndex = index + itemsToShow

      setCurrentIndex(targetIndex)

      setTimeout(() => {
        if (targetIndex >= numItems + itemsToShow) {
          setCurrentIndex(targetIndex - numItems)
          setIsTransitioning(false)
        } else if (targetIndex < itemsToShow) {
          setCurrentIndex(numItems + targetIndex)
          setIsTransitioning(false)
        } else {
          setIsTransitioning(false)
        }
      }, 300)
    },
    [isTransitioning, itemsToShow, numItems],
  )

  useImperativeHandle(ref, () => ({
    slidePrev: () => slide(PREV),
    slideNext: () => slide(NEXT),
    carouselContainer: carouselContainerRef.current,
  }))

  const handleMouseEnter = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      onMouseEnter?.(e)
      setIsPlaying(false)
    },
    [onMouseEnter],
  )
  const handleMouseLeave = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      onMouseLeave?.(e)
      setIsPlaying(true)
    },
    [onMouseLeave],
  )

  const getTransformValue = () => {
    const offset = -currentIndex * (100 / itemsToShow)
    return `translateX(${offset}%)`
  }

  const renderDots = useCallback(
    () =>
      numItems > 0 && (
        <span className={bem("dots", undefined, classNameDots)}>
          {childrenArray.map((_, i) => {
            const isActive =
              i === (currentIndex - itemsToShow + numItems) % numItems
            return (
              <button
                // eslint-disable-next-line react/no-array-index-key
                key={`carousel-dot-${i}`}
                tabIndex={0}
                className={bem(
                  "dots__dot",
                  {
                    "is-active": isActive,
                  },
                  classNameDot,
                )}
                onClick={() => slideToIndex(i)}
                onKeyDown={(e: KeyboardEvent) =>
                  e.key === "Enter" && slideToIndex(i)
                }
              />
            )
          })}
        </span>
      ),
    [
      numItems,
      childrenArray,
      currentIndex,
      classNameDots,
      classNameDot,
      itemsToShow,
      slideToIndex,
    ],
  )

  if (numItems === 0) {
    return null
  }

  return (
    <div
      aria-label="Carousel"
      role="button"
      tabIndex={0}
      {...props}
      ref={carouselContainerRef}
      className={bem(
        undefined,
        {
          "is-active": mouseActive,
        },
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(e)
        switch (e.key) {
          case "ArrowLeft":
            slide("NEXT")
            break
          case "ArrowRight":
            slide("PREV")
            break
          default:
            break
        }
      }}
      onMouseDown={(e: MouseEvent<HTMLDivElement>) => {
        onMouseDown?.(e)
        handleMouseDown(e, mouseStartX)
        setMouseActive(true)
      }}
      onMouseUp={(e: MouseEvent<HTMLDivElement>) => {
        onMouseUp?.(e)
        handleMouseUp(e, mouseStartX, mouseEndX, slide)
        setMouseActive(false)
      }}
      onTouchEnd={(e: TouchEvent<HTMLDivElement>) => {
        onTouchEnd?.(e)
        handleTouchEnd(touchStartX, touchEndX, slide)
      }}
      onTouchMove={(e: TouchEvent<HTMLDivElement>) => {
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
          transition: isTransitioning ? "transform 0.3s ease-in-out" : "none",
        }}
      >
        {items.map((child, i) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={`carousel-item-${i}`}
            className={bem("item", undefined, classNameItem)}
            style={{
              width: `${100 / itemsToShow}%`,
            }}
          >
            {child}
          </div>
        ))}
      </div>
      <div
        className={bem("mobile__tutorial", {
          "is-hidden": !Boolean(mobileTutorialVisible),
        })}
      >
        <div className={bem("mobile__tutorial__animation")}>
          <Lottie animationName="Swipe" />
        </div>
      </div>
      <footer className={bem("controls", undefined, classNameControls)}>
        {Boolean(enableControl) && (
          <Button
            aria-label="Swipe one slide backwards"
            className={bem("button", undefined, classNameButtons)}
            variant="outlined"
            iconProps={{
              name: "ArrowLeft01Icon",
              size: "md",
              color: "white"
            }}
            onClick={() => slide(PREV)}
          />
        )}
        {renderDots()}
        {Boolean(enableControl) && (
          <Button
            aria-label="Swipe one slide forwards"
            className={bem("button", undefined, classNameButtons)}
            variant="outlined"
            iconProps={{
              name: "ArrowRight01Icon",
              size: "md",
              color: "white"
            }}
            onClick={() => slide(NEXT)}
          />
        )}
      </footer>
    </div>
  )
}

Carousel.displayName = "Carousel"
