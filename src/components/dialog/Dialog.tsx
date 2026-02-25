import { createIsland } from "@/helpers/createIsland"

import DialogServer from "./Dialog.server"

import type { DialogProps } from "./Dialog.model"

export const Dialog = createIsland<DialogProps>({
  name: "Dialog",
  Server: DialogServer,
  loadLazy: /* istanbul ignore next */ () => import("./Dialog.lazy"),
  // erzwinge Client, sobald jemand open/close benutzt
  isInteractive: /* istanbul ignore next */ () => true,
})
