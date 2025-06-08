import SideNavView from "./SideNav.view"

import type { SideNavProps } from "./SideNav.model"
import type { JSX } from "react"

/** Non-interactive SSR fallback – always expanded */
export default function SideNavServer(props: SideNavProps): JSX.Element {
  return <SideNavView {...props} collapsed={props.initialCollapsed ?? false} interactive={false} />
}
