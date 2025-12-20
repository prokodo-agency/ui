import type { IconProps, IconName } from "../icon"
import type { LinkProps } from "../link"
import type { ReactNode } from "react"

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

export type SideNavProps = {
  /** list of primary nav links */
  items: SideNavItem[]
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
}

export type SideNavViewProps = SideNavProps & {
  collapsed: boolean
  onToggle?: () => void
  interactive?: boolean
}
