import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import TabsClient from "./Tabs.client"
import TabsServer from "./Tabs.server"

import type { TabsProps } from "./Tabs.model"

export default createLazyWrapper<TabsProps>({
  name: "Tabs",
  Client: TabsClient,
  Server: TabsServer,
  isInteractive: () => true,
})
