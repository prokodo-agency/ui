import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import SideNavClient from "./SideNav.client"
import SideNavServer from "./SideNav.server"

import type { SideNavProps } from "./SideNav.model"

export default createLazyWrapper<SideNavProps>({
  name: "SideNav",
  Client: SideNavClient,
  Server: SideNavServer,
  isInteractive: () => true,
})
