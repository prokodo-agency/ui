"use client"

import { create } from "@/helpers/bem"
import { useUIRuntime } from "@/helpers/runtime.client"
import { isString } from "@/helpers/validations"

import styles from "./Image.module.scss"

import type { ImageProps } from "./Image.model"
import type { FC } from "react"

const bem = create(styles, "Image")

const ImageClient: FC<ImageProps> = ({
  alt,
  caption,
  containerClassName,
  captionClassName,
  className,
  ...props
}) => {
  console.log(props)
  const { imageComponent: ctxImage } = useUIRuntime()
  const CustomImage = ctxImage ?? "img"

  const renderImage = () => (
    <CustomImage
      alt={alt ?? ""}
      className={bem("image", undefined, className)}
      {...props}
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

export default ImageClient
