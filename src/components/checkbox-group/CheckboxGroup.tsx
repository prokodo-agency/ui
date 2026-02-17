/* istanbul ignore file */
import { createIsland } from "@/helpers/createIsland"

import CheckboxGroupServer from "./CheckboxGroup.server"

import type { CheckboxGroupProps } from "./CheckboxGroup.model"

export const CheckboxGroup = createIsland<CheckboxGroupProps<string>>({
  name: "CheckboxGroup",
  Server: CheckboxGroupServer,
  /* istanbul ignore next */
  loadLazy: () => import("./CheckboxGroup.lazy"),
})
