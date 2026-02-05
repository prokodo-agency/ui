import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import TooltipClient from "./Tooltip.client"
import TooltipServer from "./Tooltip.server"

import type { TooltipProps } from "./Tooltip.model"

export default createLazyWrapper<TooltipProps>({
  name: "Tooltip",
  Client: TooltipClient,
  Server: TooltipServer,
  // Tooltips must react immediately; IO-hydration is usually not worth it here.
  hydrateOnVisible: false,
})
