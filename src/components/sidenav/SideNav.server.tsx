import SideNavView from "./SideNav.view"

import type { SideNavProps } from "./SideNav.model"
import type { JSX } from "react"

/** Non-interactive SSR fallback with the same initial state as the client. */
export default function SideNavServer(props: SideNavProps): JSX.Element {
  return (
    <SideNavView
      {...props}
      collapsed={props.collapsed ?? props.initialCollapsed ?? false}
      interactive={false}
    />
  )
}
