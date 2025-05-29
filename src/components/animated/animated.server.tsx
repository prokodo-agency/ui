import { AnimatedView } from "./Animated.view"

import type { AnimatedProps } from "./Animated.model"
import type { JSX } from "react"

export default function AnimatedServer({ ...rest }: AnimatedProps): JSX.Element {
  return <AnimatedView {...rest} isVisible={false} />
}
