import { createLazyWrapper } from "@/helpers/createLazyWrapper"
import type { SwitchProps } from "./Switch.model"
import SwitchClient from "./Switch.client"
import SwitchServer from "./Switch.server"

export default createLazyWrapper<SwitchProps>({
  name: "Switch",
  Client: SwitchClient,
  Server: SwitchServer,
  isInteractive: () => true,
})
