import type { ImageProps as NextImageProps, StaticImageData } from "next/image"
import type { ImgHTMLAttributes } from "react"

/**
 * Base image props for custom image rendering.
 * Extends native <img> attributes, excluding src/width/height (handled separately).
 */
export type BaseImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "width" | "height"
> & {
  /**
   * Optional caption rendered below the image.
   */
  caption?: string

  /**
   * Image source. Can be URL string or Next.js StaticImageData.
   */
  src?: string | StaticImageData

  /**
   * Additional class for the outer <figure> container (if caption is used).
   */
  containerClassName?: string

  /**
   * Additional class for the <figcaption> element.
   */
  captionClassName?: string
}

/**
 * Full image props when using Next.js Image.
 * Includes BaseImageProps plus Next.js image optimization props.
 *
 * @example
 * <Image src="/hero.jpg" alt="Hero" width={1200} height={600} />
 *
 * @example
 * <Image
 *   src={heroImage}
 *   alt="Hero"
 *   caption="Photo by Jane"
 *   containerClassName="rounded"
 * />
 *
 * @a11y Always provide meaningful `alt` text unless image is decorative.
 * @ssr Next.js Image is SSR-safe.
 */
export type ImageProps = BaseImageProps & NextImageProps
