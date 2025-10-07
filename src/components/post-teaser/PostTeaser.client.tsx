"use client"
import { memo, useCallback, useMemo, useState, type FC } from "react"

import { isNumber } from "@/helpers/validations"

import { PostTeaserView } from "./PostTeaser.view"

import type { PostTeaserProps } from "./PostTeaser.model"

const PostTeaserClient: FC<PostTeaserProps> = memo(props => {
  const { readCount, readingWpm = 200 } = props

  const readMinutes = useMemo(
    () =>
      isNumber(readCount) && (readCount as number) > 0
        ? Math.max(1, Math.ceil((readCount as number) / readingWpm))
        : 0,
    [readCount, readingWpm],
  )

  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => setIsHovered(false), [])
  return (
    <PostTeaserView
      {...props}
      isHovered={isHovered}
      readCount={readCount}
      readMinutes={readMinutes}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  )
})

PostTeaserClient.displayName = "PostTeaserClient"
export default PostTeaserClient
