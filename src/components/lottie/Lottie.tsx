"use client"

import {
  type FC,
  memo,
  useEffect,
  useRef,
  useState,
  lazy,
  Suspense,
} from "react"

import { create } from "@/helpers/bem"

import styles from "./Lottie.module.scss"

import type { LottieProps } from "./Lottie.model"

const bem = create(styles, "Lottie")

const DotLottieReact = lazy(() =>
  import("@lottiefiles/dotlottie-react").then(mod => ({
    default: mod.DotLottieReact,
  })),
)

export const Lottie: FC<LottieProps> = memo(
  ({ className, animation, containerClassName, ...props }) => {
    const [isInView, setIsInView] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting === true) {
          setIsInView(true)
          observer.disconnect()
        }
      })

      const el = containerRef.current
      if (el) observer.observe(el)

      return () => observer.disconnect()
    }, [])

    if (!animation) return null

    return (
      <div
        ref={containerRef}
        className={bem("container", undefined, containerClassName)}
      >
        {isInView ? (
          <Suspense
            fallback={
              <div
                className={bem("placeholder", undefined, containerClassName)}
              />
            }
          >
            <DotLottieReact
              autoplay
              loop
              className={bem(undefined, undefined, className)}
              renderConfig={{ devicePixelRatio: 0.9 }}
              src={animation}
              useFrameInterpolation={false}
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
