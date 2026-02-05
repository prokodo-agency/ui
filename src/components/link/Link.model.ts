import type { BaseLinkProps } from "../base-link"
import type { Variants } from "@/types/variants"
import type { MouseEventHandler, ComponentType } from "react"

/**
 * Allowed visual variants for Link (excluding white).
 */
export type LinkVariants = Omit<Variants, "white">

/**
 * Optional class names for link sub-elements.
 */
export type LinkClassNames = {
  /** Class name for the label wrapper. */
  label?: string
  /** Class name for the anchor/span element. */
  link?: string
}

/**
 * Shared Link props for both href and click-only links.
 */
export type LinkDefaultProps = BaseLinkProps & {
  /** Visual variant token. */
  variant?: LinkVariants
  /** Optional class name overrides. */
  classNames?: LinkClassNames
  /** Whether the link renders with a background style. */
  hasBackground?: boolean
  /** ARIA label for non-text links. */
  ariaLabel?: string
  /** Click handler for the anchor element. */
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

/**
 * Link props when using a navigation URL.
 */
export type LinkHrefProps = LinkDefaultProps & {
  /** Destination URL. */
  href: string
}

/**
 * Link props when acting as a button-like action.
 */
export type LinkClickProps = LinkDefaultProps & {
  /** Click handler is required when no href is provided. */
  onClick: MouseEventHandler<HTMLAnchorElement>
}

/**
 * Union of link props (href or onClick required).
 */
export type LinkProps = LinkHrefProps | LinkClickProps

/**
 * Internal view props for Link rendering.
 */
export type LinkViewProps = LinkProps & {
  /** Tag used for rendering (a or span). */
  LinkTag: "a" | "span"
  /** Base link component used to render anchors. */
  BaseLinkComponent: ComponentType<BaseLinkProps>
  /** Whether onClick/handlers are present. */
  hasHandlers: boolean
}
