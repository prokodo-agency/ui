import { createIsland } from "@/helpers/createIsland"
import type { SelectProps } from "./Select.model"
import SelectServer from "./Select.server"

export const Select = createIsland<SelectProps>({
  name: "Select",
  Server: SelectServer,
  loadLazy: () => import("./Select.lazy"),
  isInteractive: () => true,
})
