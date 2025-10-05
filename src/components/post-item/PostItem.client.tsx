"use client"
import { memo, useMemo, type FC } from "react"

import { calculateWordCount } from "@/helpers/calculation"

import { PostItemView } from "./PostItem.view"

import type { PostItemProps } from "./PostItem.model"

const PostItemClient: FC<PostItemProps> = memo(props => {
  const { content, readingWpm = 200 } = props
  const wordCount = useMemo(() => calculateWordCount(content), [content])
  const readMinutes = useMemo(
    () => (wordCount > 0 ? Math.max(1, Math.ceil(wordCount / readingWpm)) : 0),
    [wordCount, readingWpm],
  )
  return (
    <PostItemView {...props} readMinutes={readMinutes} wordCount={wordCount} />
  )
})

PostItemClient.displayName = "PostItemClient"
export default PostItemClient
