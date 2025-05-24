"use client"

import {
  FC,
  memo,
  useEffect,
  useRef,
  useState,
  lazy,
  Suspense,
} from "react"

import { create } from "@/helpers/bem"
import styles from "./Lottie.module.scss"
import { ANIMATIONS } from "./LottieAnimations"

import type { LottieProps } from "./Lottie.model"

const bem = create(styles, "Lottie")

const DotLottieReact = lazy(() =>
  import("@lottiefiles/dotlottie-react").then(mod => ({
    default: mod.DotLottieReact,
  })),
)

export const Lottie: FC<LottieProps> = memo(
  ({ className, animationName, containerClassName, ...props }) => {
    const [isInView, setIsInView] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      })

      const el = containerRef.current
      if (el) observer.observe(el)

      return () => observer.disconnect()
    }, [])

    if (!ANIMATIONS?.[animationName]) return null

    return (
      <div
        ref={containerRef}
        className={bem("container", undefined, containerClassName)}
      >
        {isInView ? (
          <Suspense
            fallback={
              <div className={bem("placeholder", undefined, containerClassName)} />
            }
          >
            <DotLottieReact
              autoplay
              autoResizeCanvas
              loop
              className={bem(undefined, undefined, className)}
              src={ANIMATIONS[animationName]}
              useFrameInterpolation={false}
              renderConfig={{ devicePixelRatio: 0.9 }}
              {...props}
            />
          </Suspense>
        ) : (
          <div className={bem("placeholder", undefined, containerClassName)} />
        )}
      </div>
    )
  },
)

Lottie.displayName = "Lottie"
