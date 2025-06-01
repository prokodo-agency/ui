import { createIsland } from "@/helpers/createIsland"

import SelectServer from "./Select.server"

import type { SelectProps } from "./Select.model"

export const Select = createIsland<SelectProps>({
  name: "Select",
  Server: SelectServer,
  loadLazy: () => import("./Select.lazy"),
})
