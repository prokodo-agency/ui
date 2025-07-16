import { createIsland } from "@/helpers/createIsland"

import DynamicListServer from "./DynamicList.server"

import type { DynamicListProps } from "./DynamicList.model"

export const DynamicList = createIsland<DynamicListProps>({
  name: "DynamicList",
  Server: DynamicListServer,
  loadLazy: () => import("./DynamicList.lazy"),
})