import type { AnimatedTextViewProps } from "./AnimatedText.model"
import type { FC } from "react"

export const AnimatedTextView: FC<AnimatedTextViewProps> = (({ text, ...spanRest }) => (
  <span {...spanRest}>
    {text}
  </span>
))

AnimatedTextView.displayName = "AnimatedTextView"
