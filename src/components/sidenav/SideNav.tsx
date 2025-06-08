import { createIsland } from "@/helpers/createIsland"

import SideNavServer from "./SideNav.server"

export const SideNav = createIsland({
  name: "SideNav",
  Server: SideNavServer,
  loadLazy: () => import("./SideNav.lazy"),
  // Sidebar is *always* interactive (toggle button)
  isInteractive: () => true,
})
