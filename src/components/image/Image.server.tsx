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

  // Public API: <Image priority /> → eager load in server markup too
  if (Boolean(priority)) {
    imgProps.loading = "eager"
    ;(
      imgProps as ImgOnlyProps & { fetchPriority?: "high" | "low" | "auto" }
    ).fetchPriority = "high"
  }

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
