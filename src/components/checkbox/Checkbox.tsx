import { createIsland } from "@/helpers/createIsland"

import CheckboxServer from "./Checkbox.server"

import type { CheckboxProps } from "./Checkbox.model"

export const Checkbox = createIsland<CheckboxProps<string>>({
  name: "Checkbox",
  Server: CheckboxServer,
  loadLazy: /* istanbul ignore next */ () => import("./Checkbox.lazy"),
})
