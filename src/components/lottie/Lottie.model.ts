import type { DotLottieReactProps } from "@lottiefiles/dotlottie-react"

/**
 * Lottie animation props.
 * Wraps dotLottie-react with standard class names and a required animation source.
 *
 * @example
 * <Lottie animation="/animations/loader.lottie" loop autoplay />
 *
 * @example
 * <Lottie
 *   animation="/animations/success.lottie"
 *   className="w-12 h-12"
 *   containerClassName="mx-auto"
 * />
 */
export type LottieProps = Omit<DotLottieReactProps, "container"> & {
  /** Class name applied to the Lottie element. */
  className?: string
  /** Class name applied to the outer container. */
  containerClassName?: string
  /** URL or asset path to the .lottie/.json animation. */
  animation: string
}
