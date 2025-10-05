import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import AccordionClient from "./Accordion.client"
import AccordionServer from "./Accordion.server"

import type { AccordionProps } from "./Accordion.model"

export default createLazyWrapper<AccordionProps>({
  name: "Accordion",
  Client: AccordionClient,
  Server: AccordionServer,
  isInteractive: () => true,
})
