import { createIsland } from "@/helpers/createIsland"

import AccordionServer from "./Accordion.server"

import type { AccordionProps } from "./Accordion.model"

export const Accordion = createIsland<AccordionProps>({
  name: "Accordion",
  Server: AccordionServer,
  loadLazy: /* istanbul ignore next */ () => import("./Accordion.lazy"),
  isInteractive: /* istanbul ignore next */ () => true,
})
