import { createIsland } from "@/helpers/createIsland"

import SideNavServer from "./SideNav.server"

export const SideNav = createIsland({
  name: "SideNav",
  Server: SideNavServer,
  loadLazy: /* istanbul ignore next */ () => import("./SideNav.lazy"),
  // Sidebar is *always* interactive (toggle button)
  isInteractive: /* istanbul ignore next */ () => true,
})
