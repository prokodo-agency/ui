import { Children, type JSX } from "react"

import { Skeleton } from "@/components/skeleton" // optional placeholder
import { create } from "@/helpers/bem"

import styles from "./Carousel.module.scss"

import type { CarouselProps } from "./Carousel.model"

const bem = create(styles, "Carousel")

/** Static markup only – no hooks, no refs, RSC-safe */
export function CarouselView({
  itemsToShow = 1,
  className,
  classNameWrapper,
  classNameItem,
  classNameDots,
  classNameDot,
  classNameDotActive: _classNameDotActive,
  classNameButtons: _classNameButtons,
  classNameControls: _classNameControls,
  enableControl,
  enableDots: _enableDots,
  autoplay: _autoplay,
  translateX: _translateX,
  itemStyle: _itemStyle,
  responsive: _responsive,
  nextButton: _nextButton,
  prevButton: _prevButton,
  children,
  ...rest
}: CarouselProps): JSX.Element {
  const items = Children.toArray(children)

  if (items.length === 0) {
    return <Skeleton height="200px" variant="rectangular" width="100%" />
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
            // eslint-disable-next-line react/no-array-index-key
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
              // eslint-disable-next-line react/no-array-index-key
              key={`dot-${i}`}
              className={bem("dots__dot", undefined, classNameDot)}
            />
          ))}
        </span>
      )}

      {/* controls rendered but inactive until JS */}
      {Boolean(enableControl) && (
        <footer className={bem("controls")}>
          <span className={bem("button")} />
          <span className={bem("button")} />
        </footer>
      )}
    </div>
  )
}
