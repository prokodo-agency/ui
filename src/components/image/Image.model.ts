import type { ImgHTMLAttributes, ElementType } from "react"

export interface BaseImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /**
   * Optional caption rendered below the image
   */
  caption?: string

  /**
   * Additional class for the outer <figure> container (if caption is used)
   */
  containerClassName?: string

  /**
   * Additional class for the <figcaption> element
   */
  captionClassName?: string

  /**
   * Custom image component (e.g. next/image). Should accept at least `src`, `alt`, and `className`.
   */
  imageComponent?: ElementType
}

/**
 * Full image props when using a dynamic image component.
 * Defaults to <img> if no imageComponent is provided.
 */
export type ImageProps = BaseImageProps &
  (
    | {
        imageComponent?: undefined
      }
    | {
        imageComponent: ElementType
        // Let TS infer props — no extra enforcement
        // Advanced: use ComponentPropsWithRef<typeof imageComponent> to enforce, if needed
      }
  )
