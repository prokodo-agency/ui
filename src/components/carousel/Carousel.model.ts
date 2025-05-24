import type { PREV, NEXT } from "./Carousel.services"
import type { Ref, ReactNode, CSSProperties, HTMLAttributes } from "react"

export type CarouselRef = {
  slidePrev: () => void
  slideNext: () => void
  carouselContainer: HTMLDivElement | null
}

export type CarouselProps = HTMLAttributes<HTMLDivElement> & {
  ref?: Ref<CarouselRef>
  autoplay?: number
  enableControl?: boolean
  translateX?: string
  itemStyle?: CSSProperties
  itemsToShow?: number
  className?: string
  classNameControls?: string
  classNameButtons?: string
  classNameWrapper?: string
  classNameItem?: string
  classNameDots?: string
  classNameDot?: string
  children: ReactNode
}

export type CarouselDirection = typeof PREV | typeof NEXT
