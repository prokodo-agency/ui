import { createIsland } from "@/helpers/createIsland"

import ProgressBarServer from "./ProgressBar.server"

import type { ProgressBarProps } from "./ProgressBar.model"

export const ProgressBar = createIsland<ProgressBarProps>({
  name: "ProgressBar",
  Server: ProgressBarServer,
  loadLazy: /* istanbul ignore next */ () => import("./ProgressBar.lazy"),
  isInteractive: /* istanbul ignore next */ () => true,
})
