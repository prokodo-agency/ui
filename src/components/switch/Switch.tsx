import { createIsland } from "@/helpers/createIsland"

import SwitchServer from "./Switch.server"

import type { SwitchProps } from "./Switch.model"

export const Switch = createIsland<SwitchProps>({
  name: "Switch",
  Server: SwitchServer,
  loadLazy: /* istanbul ignore next */ () => import("./Switch.lazy"),
})
