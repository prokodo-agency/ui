import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import SelectClient from "./Select.client"
import SelectServer from "./Select.server"

import type { SelectProps } from "./Select.model"

export default createLazyWrapper<SelectProps>({
  name: "Select",
  Client: SelectClient,
  Server: SelectServer,
})
