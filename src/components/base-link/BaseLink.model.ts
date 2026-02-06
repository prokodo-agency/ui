import type { AnchorHTMLAttributes, ReactNode, ComponentType } from "react"

/**
 * Base link component props with optional custom link component support.
 * Used as a foundation for other link-based components.
 *
 * @example
 * ```tsx
 * <BaseLink href="/page">Go to page</BaseLink>
 * ```
 *
 * @example
 * ```tsx
 * // With Next.js Link component
 * <BaseLink href="/page" linkComponent={NextLink}>
 *   Navigate
 * </BaseLink>
 * ```
 *
 * @a11y Screen readers announce href and link purpose via children text.
 * @ssr Safe to render; no hydration issues.
 */
export interface BaseLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Target URL (relative or absolute). */
  href: string
  /** Link content. */
  children?: ReactNode
  /** Disable link (prevent navigation). */
  disabled?: boolean
  /** Custom link component (e.g., Next.js Link) to use instead of <a>. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  linkComponent?: ComponentType<any>
}
