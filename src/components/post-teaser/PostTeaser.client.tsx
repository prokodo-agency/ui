"use client"
import { memo, useCallback, useMemo, useState, type FC } from "react"

import { calculateWordCount } from "@/helpers/calculation"

import { PostTeaserView } from "./PostTeaser.view"

import type { PostTeaserProps } from "./PostTeaser.model"

const PostTeaserClient: FC<PostTeaserProps> = memo(props => {
  const { content, readingWpm = 200 } = props

  const wordCount = useMemo(() => calculateWordCount(content), [content])
  const readMinutes = useMemo(
    () => (wordCount > 0 ? Math.max(1, Math.ceil(wordCount / readingWpm)) : 0),
    [wordCount, readingWpm],
  )

  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => setIsHovered(false), [])
  return (
    <PostTeaserView
      {...props}
      isHovered={isHovered}
      readMinutes={readMinutes}
      wordCount={wordCount}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  )
})

PostTeaserClient.displayName = "PostTeaserClient"
export default PostTeaserClient
