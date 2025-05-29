import { createLazyWrapper } from "@/helpers/createLazyWrapper"
import BaseLinkClient from "./BaseLink.client"
import BaseLinkServer from "./BaseLink.server"
import type { BaseLinkProps } from "./BaseLink.model"

export default createLazyWrapper<BaseLinkProps>({
  name: "BaseLink",
  Client: BaseLinkClient,
  Server: BaseLinkServer,
  isInteractive: (p) => typeof p.linkComponent === "function",
})
