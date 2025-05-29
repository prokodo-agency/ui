import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import CalendlyClient from "./Calendly.client"
import CalendlyServer from "./Calendly.server"

import type { CalendlyProps } from "./Calendly.model"

export default createLazyWrapper<CalendlyProps>({
  name: "Calendly",
  Client: CalendlyClient,
  Server: CalendlyServer,
  hydrateOnVisible: true,
  isInteractive: () => true
})
