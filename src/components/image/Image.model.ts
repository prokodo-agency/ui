import type { ImageProps as NextImageProps, StaticImageData } from "next/image"
import type { ImgHTMLAttributes } from "react"

export type BaseImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "width" | "height"
> & {
  /**
   * Optional caption rendered below the image
   */
  caption?: string

  src?: string | StaticImageData

  /**
   * Additional class for the outer <figure> container (if caption is used)
   */
  containerClassName?: string

  /**
   * Additional class for the <figcaption> element
   */
  captionClassName?: string
}

/**
 * Full image props when using a dynamic image component.
 * Defaults to <img> if no provider is provided.
 */
export type ImageProps = BaseImageProps & NextImageProps
