export type LoadingSize = "xs" | "sm" | "md" | "lg" | "xl"

export type LoadingBaseProps = {
  className?: string
  style?: React.CSSProperties
  size?: LoadingSize
  ariaLabel?: string
  reducedMotion?: boolean
}

export type LoadingOverlayProps = LoadingBaseProps & {
  /** Show backdrop and center the spinner (default: true) */
  show?: boolean
  /** Backdrop color source */
  backdrop?: "light" | "dark" | "auto"
  /** Optional blur intensity for the backdrop */
  blur?: number
  /** z-index for overlay (default: 9999) */
  zIndex?: number
  /** Respect reduced motion; defaults to system preference on the client. */
  reducedMotion?: boolean
}

export type LoadingProps =
  | ({ variant?: "spinner" } & LoadingBaseProps)
  | ({ variant: "overlay" } & LoadingOverlayProps)
