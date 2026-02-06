import type { ImageProps } from "../image"
import type { LinkProps } from "../link"
import type { Variants } from "@/types/variants"
import type { ReactNode, HTMLAttributes } from "react"

/**
 * Avatar size preset or custom pixel value.
 */
export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | number

/**
 * User avatar component with optional image, fallback icon, and link.
 * Displays circular image or icon.
 *
 * @example
 * ```tsx
 * // With image
 * <Avatar size="lg" image={{ src: "/avatar.jpg", alt: "User" }} />
 * ```
 *
 * @example
 * ```tsx
 * // Clickable avatar
 * <Avatar
 *   size="md"
 *   image={{ src: "/profile.jpg", alt: "Profile" }}
 *   redirect={{ href: "/profile" }}
 * />
 * ```
 *
 * @a11y Image alt text required for screen readers. Links announce destination.
 * @ssr Safe to render; no hydration issues.
 */
export type AvatarProps = {
  /** Prioritize image loading (use for above-fold avatars). */
  priority?: boolean
  /** Color variant (maps to CSS classes). */
  variant?: Variants
  /** Avatar size preset or pixel value. */
  size?: AvatarSize
  /** Image source and properties. */
  image?: ImageProps
  /** Make avatar clickable (converts to link). */
  redirect?: LinkProps
  /** Custom icon element (overrides image fallback). */
  iconOverride?: ReactNode
} & HTMLAttributes<HTMLDivElement>
