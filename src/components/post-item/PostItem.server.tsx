import { calculateWordCount } from "@/helpers/calculation"

import { PostItemView } from "./PostItem.view"

import type { PostItemProps } from "./PostItem.model"
import type { JSX } from "react"

export default function PostItemServer(p: PostItemProps): JSX.Element {
  const { content, readingWpm = 200 } = p
  const wordCount = calculateWordCount(content)
  const readMinutes =
    wordCount > 0 ? Math.max(1, Math.ceil(wordCount / readingWpm)) : 0
  // Server render: no client-only Image component or skeleton state
  return <PostItemView {...p} readMinutes={readMinutes} wordCount={wordCount} />
}
