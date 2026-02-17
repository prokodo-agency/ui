import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import CheckboxClient from "./Checkbox.client"
import CheckboxServer from "./Checkbox.server"

import type { CheckboxProps } from "./Checkbox.model"

export default createLazyWrapper<CheckboxProps<string>>({
  name: "Checkbox",
  Client: CheckboxClient,
  Server: CheckboxServer,
})
