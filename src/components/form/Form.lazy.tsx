import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import { FormClient } from "./Form.client"
import FormServer from "./Form.server"

import type { FormProps } from "./Form.model"

export default createLazyWrapper<FormProps>({
  name: "Form",
  Client: FormClient,
  Server: FormServer,
})
