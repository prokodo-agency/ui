import { createIsland } from "@/helpers/createIsland"

import LinkServer from "./Link.server"

import type { LinkProps } from "./Link.model"

export const Link = createIsland<LinkProps>({
  name: "Link",
  Server: LinkServer,
  loadLazy: () => import("./Link.lazy"),
  // optional: custom predicate (e.g. always interactive if target="_blank")
  isInteractive: p => typeof p.linkComponent === "function",
})
