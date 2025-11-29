import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import styles from "./Image.module.scss"

import type { ImageProps } from "./Image.model"
import type { StaticImageData } from "next/image"
import type { FC, ElementType, ImgHTMLAttributes } from "react"

const bem = create(styles, "Image")

/** Keep only what <img> actually accepts and force src:string */
type ImgOnlyProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string
}

/** Convert union ImageProps -> safe <img> props */
function toImgOnlyProps(p: Record<string, string | number>): ImgOnlyProps {
  const {
    // Strip next/image-only props so they don't leak onto <img>
    _fill: _fill, // intentionally unused (name the same to show intent)
    _loader: _loader,
    _placeholder: _placeholder,
    _blurDataURL: _blurDataURL,
    _priority: _priority, // internal next/image flag – ignorieren
    // unsere öffentliche API: <Image priority /> → auf <img> mappen
    priority,
    _quality: _quality,
    // Note: sizes *is* valid on <img> when it's a string, so we won't strip it
    _onLoadingComplete: _onLoadingComplete,
    ...rest
  } = p

  // Normalize src to a string (handle StaticImageData)
  let src: string | undefined
  const rawSrc = rest?.src as unknown

  if (typeof rawSrc === "string") {
    src = rawSrc
  } else if (
    typeof rawSrc === "object" &&
    rawSrc !== null &&
    // explicit property check to satisfy strict-boolean-expressions
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

  // width/height can be numbers or strings; both are accepted by <img>
  const { width, height } = rest

  // Build only <img>-legal props (rest may include other valid img attrs)
  const imgProps: ImgOnlyProps = {
    ...rest,
    src,
    width,
    height,
  }

  if (Boolean(priority)) {
    // eager laden statt lazy
    imgProps.loading = "eager"
    // fetchPriority ist (noch) nicht im TS-Typ, aber im DOM erlaubt
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
  // Drop function-ish wiring on server so nothing attempts to serialize
  const {
    onClick: _dropClick,
    onKeyDown: _dropKey,
    ...rest
  } = rawProps as Record<string, unknown>

  const CustomImage: ElementType = "img"
  const imgProps = toImgOnlyProps(rest as Record<string, string | number>)

  const renderImage = () => (
    <CustomImage
      alt={alt ?? ""}
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
