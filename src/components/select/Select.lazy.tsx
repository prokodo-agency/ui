import { createLazyWrapper } from "@/helpers/createLazyWrapper"
import type { SelectProps } from "./Select.model"
import SelectClient from "./Select.client"
import SelectServer from "./Select.server"

export default createLazyWrapper<SelectProps>({
  name: "Select",
  Client: SelectClient,
  Server: SelectServer,
  isInteractive: () => true,
})
