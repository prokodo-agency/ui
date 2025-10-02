import { createIsland } from "@/helpers/createIsland"

import ProgressBarServer from "./ProgressBar.server"

import type { ProgressBarProps } from "./ProgressBar.model"

export const ProgressBar = createIsland<ProgressBarProps>({
  name: "ProgressBar",
  Server: ProgressBarServer,
  loadLazy: () => import("./ProgressBar.lazy"),
  isInteractive: () => true,
})
