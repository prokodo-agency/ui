import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import FormFieldClient, { type FormFieldProps } from "./FormField.client"
import FormFieldServer from "./FormField.server"

export default createLazyWrapper<FormFieldProps>({
  name: "FormField",
  Client: FormFieldClient,
  Server: FormFieldServer,
})
