import type { CarouselDirection } from "./Carousel.model"
import type { TouchEvent, MouseEvent } from "react"

export const NEXT = "NEXT"
export const PREV = "PREV"

export const handleTouchStart = (
  e: TouchEvent<HTMLDivElement>,
  touchStartX: { current: number },
): void => {
  touchStartX.current = e.targetTouches[0]?.clientX ?? 0
}

export const handleTouchMove = (
  e: TouchEvent<HTMLDivElement>,
  touchEndX: { current: number },
): void => {
  touchEndX.current = e.targetTouches[0]?.clientX ?? 0
}

export const handleTouchEnd = (
  touchStartX: { current: number },
  touchEndX: { current: number },
  slide: (direction: CarouselDirection) => void,
): void => {
  if (touchStartX.current - touchEndX.current > 50) {
    slide("NEXT")
  }
  if (touchStartX.current - touchEndX.current < -50) {
    slide("PREV")
  }
}

export const handleMouseDown = (
  e: MouseEvent<HTMLDivElement>,
  mouseStartX: { current: number },
): void => {
  mouseStartX.current = e.clientX
}

export const handleMouseUp = (
  e: MouseEvent<HTMLDivElement>,
  mouseStartX: { current: number },
  mouseEndX: { current: number },
  slide: (direction: CarouselDirection) => void,
): void => {
  mouseEndX.current = e.clientX
  if (mouseStartX.current - mouseEndX.current > 50) {
    slide("NEXT")
  }
  if (mouseStartX.current - mouseEndX.current < -50) {
    slide("PREV")
  }
}
