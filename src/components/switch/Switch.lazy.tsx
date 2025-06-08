import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import SwitchClient from "./Switch.client"
import SwitchServer from "./Switch.server"

import type { SwitchProps } from "./Switch.model"

export default createLazyWrapper<SwitchProps>({
  name: "Switch",
  Client: SwitchClient,
  Server: SwitchServer,
})
