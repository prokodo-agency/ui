import { createIsland } from "@/helpers/createIsland"

import FormServer from "./Form.server"

import type { FormProps } from "./Form.model"

export const Form = createIsland<FormProps>({
  name: "Form",
  Server: FormServer,
  loadLazy: () => import("./Form.lazy"),
})

Form.displayName = "Form"
