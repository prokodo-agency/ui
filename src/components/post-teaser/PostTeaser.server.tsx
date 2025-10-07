import { isNumber } from "@/helpers/validations"

import { PostTeaserView } from "./PostTeaser.view"

import type { PostTeaserProps } from "./PostTeaser.model"
import type { JSX } from "react"

export default function PostTeaserServer(p: PostTeaserProps): JSX.Element {
  const { wordCount, readingWpm = 200 } = p
  const readMinutes =
    isNumber(wordCount) && (wordCount as number) > 0
      ? Math.max(1, Math.ceil((wordCount as number) / readingWpm))
      : 0
  return (
    <PostTeaserView
      {...p}
      isHovered={false}
      readMinutes={readMinutes}
      wordCount={wordCount}
    />
  )
}
