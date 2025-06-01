import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import ChipClient from "./Chip.client"
import ChipServer from "./Chip.server"

import type { ChipProps } from "./Chip.model"

export default createLazyWrapper<ChipProps>({
  name: "Chip",
  Client: ChipClient,
  Server: ChipServer,
})
