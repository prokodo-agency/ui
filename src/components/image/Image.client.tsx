"use client"

import { create } from "@/helpers/bem"
import { useUIRuntime } from "@/helpers/runtime.client"
import { isString } from "@/helpers/validations"

import styles from "./Image.module.scss"

import type { ImageProps } from "./Image.model"
import type { StaticImageData } from "next/image"
import type { FC, ImgHTMLAttributes } from "react"

const bem = create(styles, "Image")

type PlainImgProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string
}

/**
 * Mirror the server-side prop sanitisation so the client fallback <img>
 * renders the same DOM structure and we avoid hydration mismatches.
 */
function toPlainImgProps(p: Record<string, unknown>): PlainImgProps {
  const {
    // Strip next/image-specific props so they never hit plain <img>
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

  const imgProps: PlainImgProps = {
    ...(rest as PlainImgProps),
    src,
    width,
    height,
  }

  // Public API: <Image priority /> → eager load on the client too
  if (Boolean(priority)) {
    imgProps.loading = "eager"
    ;(
      imgProps as PlainImgProps & { fetchPriority?: "high" | "low" | "auto" }
    ).fetchPriority = "high"
  }

  return imgProps
}

const ImageClient: FC<ImageProps> = ({
  alt,
  caption,
  containerClassName,
  captionClassName,
  className,
  ...rawProps
}) => {
  const { imageComponent: ctxImage } = useUIRuntime()

  const renderImage = () => {
    // If a custom imageComponent is provided (e.g. Next.js <Image />),
    // we delegate everything to it and DO NOT sanitize its props.
    if (ctxImage !== undefined) {
      const CustomImage = ctxImage as FC<unknown>
      return (
        <CustomImage
          // @ts-expect-error: custom image component prop typing is external
          alt={alt ?? ""}
          className={bem("image", undefined, className)}
          {...rawProps}
        />
      )
    }

    // Fallback: plain <img> with sanitized props (no next/image internals)
    const imgProps = toPlainImgProps(rawProps as Record<string, unknown>)

    return (
      <img
        alt={alt ?? ""}
        className={bem("image", undefined, className)}
        {...imgProps}
      />
    )
  }

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

export default ImageClient
