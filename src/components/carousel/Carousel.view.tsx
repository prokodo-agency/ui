import { create } from "@/helpers/bem"
import { Skeleton } from "@/components/skeleton"  // optional placeholder
import styles from "./Carousel.module.scss"
import type { CarouselProps } from "./Carousel.model"
import { Children } from "react"

const bem = create(styles, "Carousel")

/** Static markup only – no hooks, no refs, RSC-safe */
export function CarouselView({
  itemsToShow = 1,
  className,
  classNameWrapper,
  classNameItem,
  classNameDots,
  classNameDot,
  enableControl,
  children,
  ...rest
}: CarouselProps) {
  const items = Children.toArray(children)

  if (items.length === 0) {
    return <Skeleton variant="rectangular" width="100%" height="200px" />
  }

  return (
    <div
      {...rest}
      ref={undefined}
      className={bem(undefined, { "is-static": true }, className)}
    >
      <div className={bem("wrapper", undefined, classNameWrapper)}>
        {items.map((child, i) => (
          <div
            key={`static-carousel-${i}`}
            className={bem("item", undefined, classNameItem)}
            style={{ width: `${100 / itemsToShow}%` }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* dots – purely visual on server */}
      {items.length > 1 && (
        <span className={bem("dots", undefined, classNameDots)}>
          {items.map((_, i) => (
            <span
              key={`dot-${i}`}
              className={bem("dots__dot", undefined, classNameDot)}
            />
          ))}
        </span>
      )}

      {/* controls rendered but inactive until JS */}
      {enableControl && (
        <footer className={bem("controls")}>
          <span className={bem("button")} />
          <span className={bem("button")} />
        </footer>
      )}
    </div>
  )
}
