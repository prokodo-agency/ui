import { createIsland } from "@/helpers/createIsland"

import RTEServer from "./RTE.server"

import type { RTEProps } from "./RTE.model"

export const RTE = createIsland<RTEProps>({
  name: "RTE",
  Server: RTEServer,
  loadLazy: () => import("./RTE.lazy"),
})
