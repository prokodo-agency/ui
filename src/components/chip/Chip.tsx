import { createIsland } from "@/helpers/createIsland"

import ChipServer from "./Chip.server"

import type { ChipProps } from "./Chip.model"

export const Chip = createIsland<ChipProps>({
  name: "Chip",
  Server: ChipServer,
  loadLazy: () => import("./Chip.lazy"),
})
