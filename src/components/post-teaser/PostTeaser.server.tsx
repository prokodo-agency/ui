import { calculateWordCount } from "@/helpers/calculation"

import { PostTeaserView } from "./PostTeaser.view"

import type { PostTeaserProps } from "./PostTeaser.model"
import type { JSX } from "react"

export default function PostTeaserServer(p: PostTeaserProps): JSX.Element {
  const { content, readingWpm = 200 } = p
  const wordCount = calculateWordCount(content)
  const readMinutes =
    wordCount > 0 ? Math.max(1, Math.ceil(wordCount / readingWpm)) : 0
  return (
    <PostTeaserView
      {...p}
      isHovered={false}
      readMinutes={readMinutes}
      wordCount={wordCount}
    />
  )
}
