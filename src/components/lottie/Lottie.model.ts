import type { DotLottieConfig } from "@lottiefiles/dotlottie-react"

export type LottieProps = Omit<DotLottieConfig, "container"> & {
  className?: string
  containerClassName?: string
  animation: string
}
