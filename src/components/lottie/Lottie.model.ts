import type { ANIMATIONS } from "./LottieAnimations"
import type { DotLottieConfig } from "@lottiefiles/dotlottie-react"

export type LottieAnimation = keyof typeof ANIMATIONS

export type LottieProps = Omit<DotLottieConfig, "container"> & {
  className?: string
  containerClassName?: string
  animationName: LottieAnimation
}
