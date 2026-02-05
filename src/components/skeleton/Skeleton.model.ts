/**
 * Skeleton loading placeholder component props.
 * Displays animated placeholder while content loads.
 *
 * @example
 * ```tsx
 * // Text skeleton
 * <Skeleton width="80%" height="1.5rem" variant="text" animation="wave" />
 * ```
 *
 * @example
 * ```tsx
 * // Avatar skeleton
 * <Skeleton width="40px" height="40px" variant="circular" />
 * ```
 *
 * @example
 * ```tsx
 * // Image skeleton
 * <Skeleton width="100%" height="300px" variant="rectangular" />
 * ```
 *
 * @a11y Marked with aria-busy="true" for screen readers during load.
 * @ssr Safe to render during SSR.
 */
export type SkeletonProps = {
  /** Width of skeleton (e.g., "100%", "200px", "80%"). */
  width?: string
  /** Height of skeleton (e.g., "1.5rem", "200px"). */
  height?: string
  /**
   * Shape variant:
   * - "text": Rectangular bar (for text placeholders).
   * - "rectangular": Rectangular block (for images, cards).
   * - "circular": Perfect circle (for avatars).
   */
  variant?: "text" | "rectangular" | "circular"
  /**
   * Animation type:
   * - "pulse": Fade in/out effect.
   * - "wave": Shimmer wave effect.
   * - "none": No animation (static).
   */
  animation?: "pulse" | "wave" | "none"
  /** CSS class applied to root element. */
  className?: string
}
