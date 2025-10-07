import { isNumber } from "@/helpers/validations"

import { PostItemView } from "./PostItem.view"

import type { PostItemProps } from "./PostItem.model"
import type { JSX } from "react"

export default function PostItemServer(p: PostItemProps): JSX.Element {
  const { wordCount, readingWpm = 200 } = p
  const readMinutes =
    isNumber(wordCount) && (wordCount as number) > 0
      ? Math.max(1, Math.ceil((wordCount as number) / readingWpm))
      : 0
  // Server render: no client-only Image component or skeleton state
  return <PostItemView {...p} readMinutes={readMinutes} wordCount={wordCount} />
}
