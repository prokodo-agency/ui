import type { DotLottieReactProps } from "@lottiefiles/dotlottie-react"

export type LottieProps = Omit<DotLottieReactProps, "container"> & {
  className?: string
  containerClassName?: string
  animation: string
}
