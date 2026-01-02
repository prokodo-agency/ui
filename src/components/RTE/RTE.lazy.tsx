import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import RTEClient from "./RTE.client"
import RTEServer from "./RTE.server"

import type { RTEProps } from "./RTE.model"

export default createLazyWrapper<RTEProps>({
  name: "RTE",
  Client: RTEClient,
  Server: RTEServer,
})
