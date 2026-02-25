import { createIsland } from "@/helpers/createIsland"

import CalendlyServer from "./Calendly.server"

import type { CalendlyProps } from "./Calendly.model"

export const Calendly = createIsland<CalendlyProps>({
  name: "Calendly",
  Server: CalendlyServer,
  loadLazy: /* istanbul ignore next */ () => import("./Calendly.lazy"),
  isInteractive: /* istanbul ignore next */ () => true,
})
