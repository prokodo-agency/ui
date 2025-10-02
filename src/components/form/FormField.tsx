import { createIsland } from "@/helpers/createIsland"

import FormFieldServer from "./FormField.server"

import type { FormFieldProps } from "./FormField.client"

export const FormField = createIsland<FormFieldProps>({
  name: "FormField",
  Server: FormFieldServer,
  loadLazy: () => import("./FormField.lazy"),
})

FormField.displayName = "FormField"
