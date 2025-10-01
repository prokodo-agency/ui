import type { PREV, NEXT } from "./Carousel.services"
import type { Breakpoints, BreakpointKey } from "@/hooks/useResponsiveValue"
import type { Ref, ReactNode, CSSProperties, HTMLAttributes } from "react"

export type CarouselRef = {
  slidePrev: () => void
  slideNext: () => void
  carouselContainer: HTMLDivElement | null
}

/** Optional responsive config that the parent can pass */
export type CarouselResponsiveConfig = {
  fallback?: number // default itemsToShow when nothing matches
  breakpoints?: Breakpoints // { xs:0, sm:640, md:768, lg:1024, xl:1280 }
  valuesByBreakpoint?: Partial<Record<BreakpointKey, number>>
  valuesByQueries?: ReadonlyArray<readonly [string, number]>
  containerRules?: ReadonlyArray<{ min?: number; max?: number; value: number }>
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
  classNameDotActive?: string
  responsive?: CarouselResponsiveConfig
  children: ReactNode
}

export type CarouselDirection = typeof PREV | typeof NEXT
