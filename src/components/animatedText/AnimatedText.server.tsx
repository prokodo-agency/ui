import { AnimatedTextView } from "./AnimatedText.view"

import type { AnimatedTextProps } from "./AnimatedText.model"
import type { JSX } from "react"

/** Server-only entry: renders static markup (no chars yet). */
export default function AnimatedTextServer(
  props: AnimatedTextProps,
): JSX.Element {
  // we drop the original children so nothing is typed yet
  const { children: _ignored, ...rest } = props
  return <AnimatedTextView {...rest} text="" />
}
