"use client"
import { memo, useEffect, useMemo, useState, type FC } from "react"

import { calculateWordCount } from "@/helpers/calculation"
import { isString } from "@/helpers/validations"

import { PostItemView } from "./PostItem.view"

import type { PostItemProps } from "./PostItem.model"

const PostItemClient: FC<PostItemProps> = memo(props => {
  const {
    content,
    image,
    imageComponent: ImageComponent,
    readingWpm = 200,
  } = props

  const wordCount = useMemo(() => calculateWordCount(content), [content])
  const readMinutes = useMemo(
    () => (wordCount > 0 ? Math.max(1, Math.ceil(wordCount / readingWpm)) : 0),
    [wordCount, readingWpm],
  )

  const [imageLoaded, setImageLoaded] = useState(!ImageComponent)

  useEffect(() => {
    if (!ImageComponent) setImageLoaded(true)
  }, [ImageComponent])
  const hasImage = Boolean(ImageComponent && isString(image?.src as string))
  return (
    <PostItemView
      {...props}
      isClient
      hasImage={hasImage}
      ImageComponent={ImageComponent}
      imageLoaded={imageLoaded}
      readMinutes={readMinutes}
      wordCount={wordCount}
      onImageLoad={() => setImageLoaded(true)}
    />
  )
})

PostItemClient.displayName = "PostItemClient"
export default PostItemClient
