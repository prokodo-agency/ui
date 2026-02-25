import { createIsland } from "@/helpers/createIsland"

import AutocompleteServer from "./Autocomplete.server"

import type { AutocompleteProps } from "./Autocomplete.model"

export const Autocomplete = createIsland<AutocompleteProps>({
  name: "Autocomplete",
  Server: AutocompleteServer,
  loadLazy: /* istanbul ignore next */ () => import("./Autocomplete.lazy"),
})
