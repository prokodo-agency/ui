"use client"
import { useEffect, useMemo, useState, type FC } from "react"

import { SpinnerView, OverlayView } from "./Loading.view"

import type { LoadingProps } from "./Loading.model"

// Helpers
const getAutoScheme = (): "light" | "dark" => {
  /* istanbul ignore next */
  const html = typeof document !== "undefined" ? document.documentElement : null
  const attr = html?.getAttribute("data-theme")
  if (attr === "dark" || attr === "light") return attr
  /* istanbul ignore else */
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  }
  /* istanbul ignore next */
  return "light"
}

const useReducedMotion = (explicit?: boolean): boolean => {
  const [prefersReduced, setPrefersReduced] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handler = () => setPrefersReduced(mql.matches)
    handler()
    mql.addEventListener?.("change", handler)
    return () => mql.removeEventListener?.("change", handler)
  }, [])
  return useMemo(() => explicit ?? prefersReduced, [explicit, prefersReduced])
}

// Child prop types derived from the discriminated union
type OverlayOnlyProps = Omit<
  Extract<LoadingProps, { variant: "overlay" }>,
  "variant"
>
type SpinnerOnlyProps = Omit<
  Exclude<LoadingProps, { variant: "overlay" }>,
  "variant"
>

const OverlayClient: FC<OverlayOnlyProps & { reducedMotion: boolean }> = ({
  backdrop = "auto",
  reducedMotion,
  ...rest
}) => {
  const [scheme, setScheme] = useState<"light" | "dark">(getAutoScheme())

  useEffect(() => {
    if (backdrop !== "auto") return
    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = (e: MediaQueryListEvent) =>
      setScheme(e.matches ? "dark" : "light")
    mql.addEventListener?.("change", onChange)
    return () => mql.removeEventListener?.("change", onChange)
  }, [backdrop])

  const resolved = backdrop === "auto" ? scheme : backdrop
  return (
    <OverlayView
      {...rest}
      reducedMotion={reducedMotion}
      resolvedBackdrop={resolved}
    />
  )
}

const SpinnerClient: FC<SpinnerOnlyProps & { reducedMotion: boolean }> = ({
  reducedMotion,
  ...rest
}) => <SpinnerView {...rest} reducedMotion={reducedMotion} />

const LoadingClient: FC<LoadingProps> = props => {
  const reducedMotion = useReducedMotion(
    "reducedMotion" in props ? props.reducedMotion : undefined,
  )

  if (props.variant === "overlay") {
    const { variant: _v, ...rest } = props as Extract<
      LoadingProps,
      { variant: "overlay" }
    >
    return <OverlayClient {...rest} reducedMotion={reducedMotion} />
  }

  // spinner (default)
  const { variant: _v, ...rest } = props as Exclude<
    LoadingProps,
    { variant: "overlay" }
  >
  return (
    <SpinnerClient
      {...(rest as SpinnerOnlyProps)}
      reducedMotion={reducedMotion}
    />
  )
}

export default LoadingClient
