import { createIsland } from "@/helpers/createIsland"

import TooltipServer from "./Tooltip.server"

import type { TooltipProps } from "./Tooltip.model"

export const Tooltip = createIsland<TooltipProps>({
  name: "Tooltip",
  Server: TooltipServer,
  loadLazy: /* istanbul ignore next */ () => import("./Tooltip.client"),
  // Hydrate only when you actually need JS timing/controlled state/etc.
  isInteractive: /* istanbul ignore next */ p =>
    Boolean(
      (p.portal ?? true) ||
        p.preventOverflow ||
        p.open !== undefined ||
        p.defaultOpen !== undefined ||
        typeof p.onOpenChange === "function" ||
        typeof p.delay === "number" ||
        typeof p.closeDelay === "number",
    ),
})
