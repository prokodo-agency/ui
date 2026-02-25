import { createIsland } from "@/helpers/createIsland"

import BaseLinkServer from "./BaseLink.server"

import type { BaseLinkProps } from "./BaseLink.model"

const isInteractive = (p: BaseLinkProps) =>
  typeof p.linkComponent === "function"

export const BaseLink = createIsland<BaseLinkProps>({
  name: "BaseLink",
  Server: BaseLinkServer,
  loadLazy: /* istanbul ignore next */ () => import("./BaseLink.lazy"),
  isInteractive,
})
