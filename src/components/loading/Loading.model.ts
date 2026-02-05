/**
 * Size tokens for the loading indicator.
 */
export type LoadingSize = "xs" | "sm" | "md" | "lg" | "xl"

/**
 * Base props shared by all loading variants.
 */
export type LoadingBaseProps = {
  /** Optional class name for the loader element. */
  className?: string
  /** Inline styles for the loader element. */
  style?: React.CSSProperties
  /** Loader size token. */
  size?: LoadingSize
  /** Accessible label for screen readers. */
  ariaLabel?: string
  /** Respect reduced motion preferences (overrides system preference). */
  reducedMotion?: boolean
}

/**
 * Overlay loading props.
 * Adds a backdrop and centers the indicator.
 */
export type LoadingOverlayProps = LoadingBaseProps & {
  /** Show backdrop and center the spinner (default: true). */
  show?: boolean
  /** Backdrop color source. */
  backdrop?: "light" | "dark" | "auto"
  /** Optional blur intensity for the backdrop. */
  blur?: number
  /** z-index for overlay (default: 9999). */
  zIndex?: number
  /** Respect reduced motion; defaults to system preference on the client. */
  reducedMotion?: boolean
}

/**
 * Loading component props.
 * Supports a basic spinner or an overlay variant.
 *
 * @example
 * <Loading size="md" />
 *
 * @example
 * <Loading variant="overlay" backdrop="dark" show />
 */
export type LoadingProps =
  | ({ variant?: "spinner" } & LoadingBaseProps)
  | ({ variant: "overlay" } & LoadingOverlayProps)
