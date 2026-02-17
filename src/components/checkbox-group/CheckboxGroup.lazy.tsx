import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import CheckboxGroupClient from "./CheckboxGroup.client"
import CheckboxGroupServer from "./CheckboxGroup.server"

import type { CheckboxGroupProps } from "./CheckboxGroup.model"

export default createLazyWrapper<CheckboxGroupProps<string>>({
  name: "CheckboxGroup",
  Client: CheckboxGroupClient,
  Server: CheckboxGroupServer,
})
