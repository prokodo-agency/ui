import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import styles from "./Image.module.scss"

import type { ImageProps } from "./Image.model"
import type { StaticImageData } from "next/image"
import type { FC, ElementType, ImgHTMLAttributes } from "react"

const bem = create(styles, "Image")

type ImgOnlyProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string
}

/**
 * Convert the general ImageProps union into safe <img> props.
 * Strips all next/image specific props so they do not leak into the DOM.
 */
function toImgOnlyProps(p: Record<string, unknown>): ImgOnlyProps {
  const {
    // Strip next/image-specific props
    fill: _fill,
    loader: _loader,
    placeholder: _placeholder,
    blurDataURL: _blurDataURL,
    priority,
    quality: _quality,
    onLoadingComplete: _onLoadingComplete,
    loading: _loading,
    decoding: _decoding,
    ...rest
  } = p

  let src: string | undefined
  const rawSrc = (rest as Record<string, unknown>).src

  if (typeof rawSrc === "string") {
    src = rawSrc
  } else if (
    typeof rawSrc === "object" &&
    rawSrc !== null &&
    Object.prototype.hasOwnProperty.call(
      rawSrc as Record<string, unknown>,
      "src",
    ) &&
    typeof (rawSrc as { src?: unknown }).src === "string"
  ) {
    const rs = rawSrc as StaticImageData
    ;({ src } = rs)
  } else {
    src = undefined
  }

  const { width, height } = rest as {
    width?: number | string
    height?: number | string
  }

  const imgProps: ImgOnlyProps = {
    ...(rest as ImgOnlyProps),
    src,
    width,
    height,
  }

  // Do NOT set loading or fetchPriority for priority images — Next.js <Image>
  // handles priority via a <link rel="preload"> in <head>, not via img attributes.
  // Setting them here causes a hydration mismatch when ImageClient renders via
  // the Next.js Image component (which doesn't set those attributes on <img>).
  if (!Boolean(priority)) {
    imgProps.loading = "lazy"
  }

  // Always set these to match Next.js <Image> client output
  imgProps.decoding = "async"
  ;(imgProps as ImgOnlyProps & { "data-nimg"?: string })["data-nimg"] = "1"
  imgProps.style = { color: "transparent", ...imgProps.style }
  // Suppress hydration warning for src/srcSet — they differ because Next.js
  // optimizes URLs (/_next/image/?url=...) while the server renders the raw
  // path. React will update the attribute after hydration.
  ;(imgProps as ImgOnlyProps & { suppressHydrationWarning?: boolean })[
    "suppressHydrationWarning"
  ] = true

  return imgProps
}

const ImageServer: FC<ImageProps> = ({
  alt,
  caption,
  containerClassName,
  captionClassName,
  className,
  ...rawProps
}) => {
  // Drop function props so nothing serialises across the RSC boundary
  const {
    onClick: _dropClick,
    onKeyDown: _dropKey,
    ...rest
  } = rawProps as Record<string, unknown>

  const CustomImage: ElementType = "img"
  const imgProps = toImgOnlyProps(rest)

  const renderImage = () => (
    <CustomImage
      alt={alt ?? /* istanbul ignore next */ ""}
      className={bem("image", undefined, className)}
      {...imgProps}
    />
  )

  if (isString(caption)) {
    return (
      <figure className={bem(undefined, undefined, containerClassName)}>
        {renderImage()}
        <figcaption className={bem("caption", undefined, captionClassName)}>
          {caption}
        </figcaption>
      </figure>
    )
  }

  return renderImage()
}

export default ImageServer
