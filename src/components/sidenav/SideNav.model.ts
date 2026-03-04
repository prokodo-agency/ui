import type { HeadlineProps } from "../headline"
import type { IconProps, IconName } from "../icon"
import type { LinkProps } from "../link"
import type { ComponentType, HTMLAttributes, ReactNode } from "react"

export type SideNavItem = {
  /** active state of item */
  active?: boolean
  /** visible text when expanded */
  label: string
  /** icon component props */
  icon: IconProps
  /** href for Link – relative or absolute */
  redirect?: LinkProps
  /** onClick handler of item */
  onClick?: (e: SideNavItem) => void
}

/**
 * A labelled section of navigation items rendered inside the sidebar.
 * Shows an optional headline and description when the nav is expanded.
 */
export type SideNavSection = {
  /**
   * Short section label shown above the items (e.g. "General", "Admin").
   * Hidden in collapsed mode.
   */
  headline?: string
  /**
   * Optional longer description rendered below the headline.
   * Hidden in collapsed mode.
   */
  description?: string
  /** Navigation items belonging to this section. */
  items: SideNavItem[]
  /** Optional React component to render as the section headline (overrides `headline` string). */
  headlineComponent?: ComponentType<{ className?: string }>
  /** Additional props forwarded to the internal `Headline` component (excluding `children`). */
  headlineProps?: Omit<HeadlineProps, "children">
  /** Additional props forwarded to the description `<p>` element (excluding `children`). */
  descriptionProps?: Omit<HTMLAttributes<HTMLParagraphElement>, "children">
}

export type SideNavProps = {
  /** flat list of primary nav links (used when `sections` is not provided) */
  items?: SideNavItem[]
  /** structured navigation sections with optional headline + description */
  sections?: SideNavSection[]
  /** initial collapsed state (default = false) */
  initialCollapsed?: boolean
  /** collapsed menu icon */
  collapsedIcon?: IconName
  /** collapsed label (for Screenreaders) */
  collapsedLabel?: string
  /** un collapsed menu icon */
  unCollapsedIcon?: IconName
  /** uncollapsed label (for Screenreaders) */
  unCollapsedLabel?: string
  /** additional icon props for collapsed/uncollapsed Icon */
  iconProps?: Omit<IconProps, "name">
  /** aria-label for <nav> (default: "Main navigation") */
  ariaLabel?: string
  /** className passthrough */
  className?: string
  /** Optional footer node of sidenav */
  renderFooter?: () => ReactNode
  /** onChange handler of sidenav */
  onChange?: (e: SideNavItem) => void
  /**
   * Default props applied to the `Headline` component in every section.
   * Section-level `headlineProps` take precedence.
   */
  headlineProps?: Omit<HeadlineProps, "children">
  /**
   * Default props applied to the description `<p>` element in every section.
   * Section-level `descriptionProps` take precedence.
   */
  descriptionProps?: Omit<HTMLAttributes<HTMLParagraphElement>, "children">
}

export type SideNavViewProps = SideNavProps & {
  collapsed: boolean
  onToggle?: () => void
  interactive?: boolean
}
