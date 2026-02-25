import { createIsland } from "@/helpers/createIsland"

import TabsServer from "./Tabs.server"

import type { TabsProps } from "./Tabs.model"

export const Tabs = createIsland<TabsProps>({
  name: "Tabs",
  Server: TabsServer,
  loadLazy: /* istanbul ignore next */ () => import("./Tabs.lazy"),
  isInteractive: /* istanbul ignore next */ () => true,
})
