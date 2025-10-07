"use client"
import { memo, useMemo, type FC } from "react"

import { isNumber } from "@/helpers/validations"

import { PostItemView } from "./PostItem.view"

import type { PostItemProps } from "./PostItem.model"

const PostItemClient: FC<PostItemProps> = memo(props => {
  const { wordCount, readingWpm = 200 } = props
  const readMinutes = useMemo(
    () =>
      isNumber(wordCount) && (wordCount as number) > 0
        ? Math.max(1, Math.ceil((wordCount as number) / readingWpm))
        : 0,
    [wordCount, readingWpm],
  )
  return (
    <PostItemView {...props} readMinutes={readMinutes} wordCount={wordCount} />
  )
})

PostItemClient.displayName = "PostItemClient"
export default PostItemClient
