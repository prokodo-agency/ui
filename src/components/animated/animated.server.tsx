import { AnimatedView } from "./Animated.view"

import type { AnimatedProps } from "./Animated.model"

/**
 * Server‐only entry: always renders the static view
 * with isVisible=false (no animation yet).
 */
export default function AnimatedServer(props: AnimatedProps) {
  const { delay, intersectionObserverOptions, onAnimate, ...rest } = props
  return <AnimatedView {...rest} isVisible={false} />
}
